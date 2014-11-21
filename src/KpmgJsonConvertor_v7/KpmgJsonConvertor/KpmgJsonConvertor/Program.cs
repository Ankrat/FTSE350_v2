using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Configuration;
using KpmgJsonConvertor.Utilities;

namespace KpmgJsonConvertor
{
    class Program
    {
        private const int _secondsToClose = 20;

        static void Main(string[] args)
        {
            try
            {
                string importDirectory = ConfigurationManager.AppSettings["directory.importFile"];

                string failDirectory = Path.Combine(importDirectory, "Failed");
                string successDirectory = Path.Combine(importDirectory, "Success"); ;

                // check whether the success/fail directories exist
                if (!Directory.Exists(failDirectory))
                {
                    Directory.CreateDirectory(failDirectory);
                }

                if (!Directory.Exists(successDirectory))
                {
                    Directory.CreateDirectory(successDirectory);
                }


                KpmgProcessor processor = new KpmgProcessor();

                string[] files = Directory.GetFiles(importDirectory);

                Console.WriteLine("There are " + files.Count() + " files to process.");
                Console.WriteLine();

                for (int x = 0; x < files.Count(); x++)
                {
                    string error;
                    Utilities.Enums.Status status;

                    Console.Write("Processing file " + (x + 1).ToString() + " of " + files.Count() + "...");
                    try
                    {
                        if (Path.GetExtension(files[x]) == ".json")
                        {
                            processor.ProcessFile(files[x], out error, out status);
                            if (status == Utilities.Enums.Status.OK)
                            {
                                //move to success
                                string successFilePath = Path.Combine(Path.GetDirectoryName(files[x]), "Success", Path.GetFileName(files[x]));
                                if (File.Exists(successFilePath))
                                {
                                    File.Delete(successFilePath);
                                }
                                MoveToSuccess(files[x]);
                                ConsoleHelper.PrintValidationResult("Success");
                            }
                            else
                            {
                                //move file to failed
                                MoveToFailedAndCreateLog(files[x], error);
                                ConsoleHelper.PrintValidationResult("Fail");
                            }
                        }
                        else
                        {
                            error = "Invalid file format: " + Path.GetFileName(files[x]);

                            //move file to failed
                            MoveToFailedAndCreateLog(files[x], error);
                            ConsoleHelper.PrintValidationResult("Fail");
                        }

                        //Thread.Sleep(2 * 1000);//sleep for 2 seconds to allow reading of import success in console app
                    }
                    catch (Exception ex)
                    {
                        //move file to failed
                        MoveToFailedAndCreateLog(files[x], ex.ToString());
                        ConsoleHelper.PrintValidationResult("Fail");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                CloseApp();
            }
        }

        private static void MoveToFailedAndCreateLog(string filePath, string error)
        {
            DateTime dateFailed = DateTime.Now;//add date to failed files to ensure unique filename
            string failedPath = Path.Combine(Path.GetDirectoryName(filePath), "Failed");
            string newFileNameWithoutExtension = Path.Combine(failedPath, Path.GetFileNameWithoutExtension(filePath) + "_" + dateFailed.ToString("yyyy-MM-dd_mm-ss-fff"));
            string newFilenameWithExtension = newFileNameWithoutExtension + Path.GetExtension(filePath);
            if (File.Exists(newFilenameWithExtension))
            {
                File.Delete(newFilenameWithExtension);
            }
            if (File.Exists(newFileNameWithoutExtension + ".log"))
            {
                File.Delete(newFileNameWithoutExtension + ".log");
            }
            File.Move(filePath, newFilenameWithExtension);
            File.WriteAllText(newFileNameWithoutExtension + ".log", error);
        }

        private static void MoveToSuccess(string filePath)
        {
            DateTime dateSuccess = DateTime.Now;//add date to failed files to ensure unique filename
            string successPath = Path.Combine(Path.GetDirectoryName(filePath), "Success");
            string newFileNameWithoutExtension = Path.Combine(successPath, Path.GetFileNameWithoutExtension(filePath) + "_" + dateSuccess.ToString("yyyy-MM-dd_mm-ss-fff"));
            string newFilenameWithExtension = newFileNameWithoutExtension + Path.GetExtension(filePath);
            if (File.Exists(newFilenameWithExtension))
            {
                File.Delete(newFilenameWithExtension);
            }
            File.Move(filePath, newFilenameWithExtension);
        }

        private static void CloseApp()
        {
            Console.WriteLine();
            Console.WriteLine("View the contents of " + ConfigurationManager.AppSettings["directory.importFile"] + "\\Failed to view any failure messages");
            Console.WriteLine();
            Console.WriteLine("Program Complete");
            Console.WriteLine("Closing in " + _secondsToClose.ToString() + " seconds...");
            Thread.Sleep(_secondsToClose * 1000);
        }

    }
}
