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

namespace EventStore.LoadTest
{
    class Program
    {
        static int threadCount;
        static int top;
        static string url;
        static long count;
        static long lowest;
        static long highest;
        static long avgAccumulator;
        static long errors;
        static object syncRoot = new Object();
        static RestClient restClient;
        static IList<string> urls = new List<string>(new string[] { });

        static void Main(string[] args)
        {
            SetupSslValidation();
            ReadConfig();
            restClient = new RestClient(url);
            var mainStopWatch = new Stopwatch();

            Console.WriteLine("About make {0} requests.", top);

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
            var request = new RestRequest(Method.GET);

            while (true)
            {
                var shouldContinue = false;
                SetUpRequest(request);

                lock (syncRoot)
                {
                    if (count < top)
                    {
                        shouldContinue = true;
                        count++;
                    }

                    if (count % 1000 == 0 && count != top)
                    {
                        WriteProgress();
                    }
                }

                if (shouldContinue)
                {
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
                    //Console.WriteLine("Killing thread.");
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

        private static void SetUpRequest(RestRequest request)
        {
            request.Parameters.Clear();
            request.AddHeader("Accept", "application/json");
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
            top = int.Parse(ConfigurationManager.AppSettings["top"]);
            url = ConfigurationManager.AppSettings["url"];
        }
    }
}