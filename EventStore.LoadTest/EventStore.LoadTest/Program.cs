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
        static int taskCount;
        static int top;
        static string url;
        static long count;
        static long errors;
        static object syncRoot = new Object();
        static string body;
        static RestClient restClient;

        static void Main(string[] args)
        {
            ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
            ReadConfig();
            ReadJsonBody();
            restClient = new RestClient(url);
            var stopWatch = new Stopwatch();

            Console.WriteLine("About to push {0} events.", top);

            stopWatch.Start();
            Task[] tasks = StartPushEventsTasks();
            Console.WriteLine("{0} tasks are running. Waiting for them to finish.", taskCount);

            Task.WaitAll(tasks);

            stopWatch.Stop();
            WriteElapsedTime(stopWatch.Elapsed);
            Console.WriteLine("All tasks have finished, press <ENTER> to exit.");

            Console.ReadKey();
        }

        private static void PushEvent()
        {
            var request = new RestRequest(Method.POST);

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
                    var response = restClient.Execute(request);
                    if (response.StatusCode != System.Net.HttpStatusCode.Created)
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

        private static void WriteProgress()
        {
            Console.WriteLine("Progress: {0}", count);
            Console.WriteLine("Errors: {0}", errors);
        }

        private static string GetBasicAuthHeader()
        {
            var username = ConfigurationManager.AppSettings["username"];
            var password = ConfigurationManager.AppSettings["password"];
            var usrAndPass = string.Format("{0}:{1}", username, password);
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(usrAndPass);
            return "Basic " + System.Convert.ToBase64String(plainTextBytes);
        }

        private static void SetUpRequest(RestRequest request)
        {
            request.Parameters.Clear();
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Authorization", GetBasicAuthHeader());
            request.AddHeader("ES-EventType", "Test");
            request.AddHeader("ES-ExpectedVersion", "-2");
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            request.RequestFormat = DataFormat.Json;
            request.AddHeader("ES-EventId", Guid.NewGuid().ToString());
        }

        private static Task[] StartPushEventsTasks()
        {
            var tasks = new Task[taskCount];
            for (int i = 0; i < taskCount; i++)
            {
                tasks[i] = Task.Factory.StartNew(() => PushEvent());
            }
            return tasks;
        }

        private static void WriteElapsedTime(TimeSpan elapsed)
        {
            string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                elapsed.Hours, elapsed.Minutes, elapsed.Seconds,
                elapsed.Milliseconds / 10);
            Console.WriteLine("RunTime " + elapsedTime);
        }

        private static void ReadJsonBody()
        {
            var fileName = ConfigurationManager.AppSettings["sampleFile"];
            using (var reader = File.OpenText(fileName))
            {
                body = reader.ReadToEnd();
            }
        }

        private static void ReadConfig()
        {
            taskCount = int.Parse(ConfigurationManager.AppSettings["taskCount"]);
            top = int.Parse(ConfigurationManager.AppSettings["top"]);
            url = ConfigurationManager.AppSettings["url"];
        }
    }
}