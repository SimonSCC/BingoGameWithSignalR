using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRBingoWeb
{
    public class GameMethods
    {
        public static List<string> JoinedUsers = new List<string>();
        public static List<int> MentionedNumbers = new List<int>();

  
        public static int NewRandomNumber()
        {           

            int number = new Random().Next(1, 50);

            while (MentionedNumbers.Contains(number))
            {
                number = new Random().Next(1, 50);
                if (MentionedNumbers.Count >= 49)
                {
                    Console.WriteLine("Game is done.. Can't generate any new numbers");
                    break;
                }
            }

            MentionedNumbers.Add(number);
            return number;
        }
        public static bool IsBingo(List<string> strings)
        {
            List<int[]> allColumns = GetIntArrays(strings);
            foreach (int[] arr in allColumns)
            {
                for (int i = 0; i < arr.Length; i++)
                {
                    if (!MentionedNumbers.Contains(arr[i]))
                    {
                        return false;
                    }
                }               
            }
            return true;
        }

        public static int IsRow(List<string> strings)
        {
            List<int[]> allColumns = GetIntArrays(strings);
            int numberOfCorrectRows = 0;
            int numberOfCorrecti = 0;
            for (int x = 0; x < 4; x++)
            {
                for (int i = 0; i < 5; i++)
                {
                    if (MentionedNumbers.Contains(allColumns[i][x]))
                    {
                        var test = allColumns[i][x];
                        numberOfCorrecti++;
                    }
                }
                if (numberOfCorrecti == 5)
                {
                    numberOfCorrectRows++;
                }
                numberOfCorrecti = 0;
            }
           
            return numberOfCorrectRows;

        }

        private static List<int[]> GetIntArrays(List<string> strings)
        {
            List<int[]> intArrays = new List<int[]>();

            foreach (string word in strings)
            {
                string[] numbers = word.Split("o");
                int[] nums = new int[4];
                for (int i = 0; i < nums.Length; i++)
                {
                    nums[i] = Convert.ToInt32(numbers[i]);
                }

                intArrays.Add(nums);
            }
            return intArrays;
        }
    }
}
