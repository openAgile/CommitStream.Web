using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Net;
using System.Collections.Concurrent;

namespace EventStore.LoadTest
{
    class Program
    {
        static int threadCount;
        static int threadDelay;
        static long count;
        static long lowest;
        static long highest;
        static long avgAccumulator;
        static long errors;
        static object syncRoot = new object();
        static RestClient restClient;
        static ConcurrentQueue<string> queue = new ConcurrentQueue<string>();
        static List<string> urls = new List<string>();
        static int times;


        static void Main(string[] args)
        {
            SetupSslValidation();
            ReadAppConfig();
            ReadUrls();
            EnqueueUrls();

            var mainStopWatch = new Stopwatch();
            Console.WriteLine("Starting...");
            mainStopWatch.Start();

            Thread[] threads = StartPushEventsThreads();
            Console.WriteLine("{0} threads are running. Waiting for them to finish.", threadCount);
            WaitForAllThreads(threads);

            mainStopWatch.Stop();
            WriteElapsedTime("Total elapsed time", mainStopWatch.ElapsedMilliseconds);
            WriteElapsedTime("Max", highest);
            WriteElapsedTime("Low", lowest);
            WriteElapsedTime("Average", avgAccumulator / count);
            WriteElapsedTime("Amount of requests", count);
            WriteElapsedTime("Errors", errors);

            Console.WriteLine("All tasks have finished, press <ENTER> to exit.");

            Console.ReadKey();
        }

        private static void EnqueueUrls()
        {
            for (int i = 0; i < times; i++)
            {
                foreach (var url in urls)
                {
                    queue.Enqueue(url);
                }
            }
        }

        private static void SetupSslValidation()
        {
            ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
        }

        private static void WaitForAllThreads(Thread[] threads)
        {
            foreach (var t in threads)
            {
                t.Join();
            }
        }

        private static void PushEvent()
        {
            var threadStopWatch = new Stopwatch();

            while (true)
            {
                string url;
                if (queue.TryDequeue(out url))
                {
                    Console.WriteLine("Dequeued url: {0}.", url);
                    var restClient = new RestClient(url);
                    restClient.Timeout = 300000;
                    var request = new RestRequest(Method.GET);
                    request.Parameters.Clear();
                    request.AddHeader("Accept", "application/json");

                    lock (syncRoot)
                    {
                        count++;
                        if (count % 1000 == 0)
                        {
                            WriteProgress();
                        }
                    }

                    threadStopWatch.Restart();
                    var response = restClient.Execute(request);
                    threadStopWatch.Stop();

                    lock (syncRoot)
                    {
                        processStopWatch(threadStopWatch.ElapsedMilliseconds);
                    }

                    if (response.StatusCode != System.Net.HttpStatusCode.OK)
                    {
                        lock (syncRoot) { errors++; }
                        Console.WriteLine("Url: {0}", url);
                        Console.WriteLine("ErrorMessage: {0}", response.ErrorMessage);
                        Console.WriteLine("StatusCode: {0}", response.StatusCode);
                        Console.WriteLine("Content: {0}", response.Content);
                        Console.WriteLine("StatusDescription: {0}", response.StatusDescription);
                        Console.WriteLine();
                    }
                }
                else
                {
                    break;
                }
            }
        }

        private static void processStopWatch(long elapsedMilliseconds)
        {
            avgAccumulator += elapsedMilliseconds;
            if (elapsedMilliseconds < lowest)
            {
                lowest = elapsedMilliseconds;
            }

            if (highest < elapsedMilliseconds)
            {
                highest = elapsedMilliseconds;
            }
        }

        private static void WriteProgress()
        {
            Console.WriteLine("Progress: {0}", count);
            Console.WriteLine("Errors: {0}", errors);
        }

        private static Thread[] StartPushEventsThreads()
        {
            var threads = new Thread[threadCount];
            for (int i = 0; i < threadCount; i++)
            {
                threads[i] = new Thread(PushEvent);
                threads[i].IsBackground = true;
                threads[i].Start();
                Thread.Sleep(1000 * threadDelay);
            }
            return threads;
        }

        private static void WriteElapsedTime(string message, long elapsedMs)
        {
            Console.WriteLine("{0}: {1}", message, elapsedMs);
        }

        private static void ReadAppConfig()
        {
            threadCount = int.Parse(ConfigurationManager.AppSettings["threadCount"]);
            times = int.Parse(ConfigurationManager.AppSettings["times"]);
            threadDelay = int.Parse(ConfigurationManager.AppSettings["threadDelay"]);
        }

        private static void ReadUrls()
        {

            var fileName = ConfigurationManager.AppSettings["urlsFile"];
            using (var reader = File.OpenText(fileName))
            {
                var file = reader.ReadToEnd();
                var array = JArray.Parse(file);
                urls = array.ToObject<List<string>>();
            }

        }
    }
}