using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KpmgJsonConvertor.Utilities
{
    public static class ConsoleHelper
    {
        public static void PrintValidationResult(string result)
        {
            switch (result)
            {
                case "Success":
                    Console.ForegroundColor = ConsoleColor.Green;
                    break;
                case "Fail":
                    Console.ForegroundColor = ConsoleColor.Red;
                    break;
                default:
                    Console.ForegroundColor = ConsoleColor.Gray;
                    break;
            }

            Console.WriteLine(result);

            //reset
            Console.ForegroundColor = ConsoleColor.Gray;
        }
    }


}
