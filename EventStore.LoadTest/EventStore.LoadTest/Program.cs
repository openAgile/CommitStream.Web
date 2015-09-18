using Newtonsoft.Json;
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
        static long count;
        static long lowest;
        static long highest;
        static long avgAccumulator;
        static long errors;
        static object syncRoot = new Object();
        static RestClient restClient;
        static ConcurrentQueue<string> urls = new ConcurrentQueue<string>();


        static void Main(string[] args)
        {
            //TODO: read from app.config
            for (int i = 0; i < 100; i++)
            {
                urls.Enqueue("http://localhost:6565/api/002e064a-0982-4785-88d7-0a92fc2884e4/commits/tags/versionone/workitems/S-01001,TK-01001,AT-01002?apiKey=71a764aa-a8bb-4de2-a6dc-59279b3b5c7c");
            }


            SetupSslValidation();
            ReadConfig();
            var mainStopWatch = new Stopwatch();

            Console.WriteLine("Starting...");

            mainStopWatch.Start();
            Thread[] threads = StartPushEventsThreads();
            Console.WriteLine("{0} tasks are running. Waiting for them to finish.", threadCount);

            WaitForAllThreads(threads);

            mainStopWatch.Stop();
            WriteElapsedTime("Total elapsed time", mainStopWatch.ElapsedMilliseconds);
            WriteElapsedTime("Max", highest);
            WriteElapsedTime("Low", lowest);
            WriteElapsedTime("Average", avgAccumulator / count);

            Console.WriteLine("All tasks have finished, press <ENTER> to exit.");

            Console.ReadKey();
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
                if (urls.TryDequeue(out url))
                {
                    var restClient = new RestClient(url);
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
                        Console.WriteLine("StatusCode: {0}", response.StatusCode);
                        Console.WriteLine("Content: {0}", response.Content);
                        Console.WriteLine("Headers: {0}", response.Headers);
                        Console.WriteLine("ErrorMessage: {0}", response.ErrorMessage);
                        Console.WriteLine("StatusDescription: {0}", response.StatusDescription);
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
                (threads[i] = new Thread(PushEvent)).Start();
            }
            return threads;
        }

        private static void WriteElapsedTime(string message, long elapsedMs)
        {
            Console.WriteLine("{0}: {1}", message, elapsedMs);
        }

        private static void ReadConfig()
        {
            threadCount = int.Parse(ConfigurationManager.AppSettings["threadCount"]);
            //url = ConfigurationManager.AppSettings["url"];
        }
    }
}