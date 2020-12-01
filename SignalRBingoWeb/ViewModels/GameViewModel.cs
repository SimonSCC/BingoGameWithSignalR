using SignalRBingoWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRBingoWeb.ViewModels
{
    public class GameViewModel
    {
        public User Player { get; set; }
        public int[] ColumnOne { get; set; }
        public string ColumnOneString { get; set; }
        public int[] ColumnTwo { get; set; }
        public string ColumnTwoString { get; set; }
        public int[] ColumnThree { get; set; }
        public string ColumnThreeString { get; set; }
        public int[] ColumnFour { get; set; }
        public string ColumnFourString { get; set; }
        public int[] ColumnFive { get; set; }
        public string ColumnFiveString { get; set; }

        public GameViewModel(User user)
        {
            Player = user;
            GenerateBoard();
        }

        public void GenerateBoard()
        {
            ColumnOne = PopulateColumn(ColumnOne, 0, 10);
            ColumnTwo = PopulateColumn(ColumnTwo, 10, 20);
            ColumnThree = PopulateColumn(ColumnThree, 20, 30);
            ColumnFour = PopulateColumn(ColumnFour, 30, 40);
            ColumnFive = PopulateColumn(ColumnFive, 40, 50);

            ColumnOneString = GenerateStringForJS(ColumnOne);
            ColumnTwoString = GenerateStringForJS(ColumnTwo);
            ColumnThreeString = GenerateStringForJS(ColumnThree);
            ColumnFourString = GenerateStringForJS(ColumnFour);
            ColumnFiveString = GenerateStringForJS(ColumnFive);

        }

        private string GenerateStringForJS(int[] column)
        {
            string stringForJs = String.Empty;
            foreach (int nr in column)
            {
                stringForJs += nr + "o";
            }
            return stringForJs;
        }

        public int[] PopulateColumn(int[] column, int min, int max)
        {
            Random rand = new Random();
            column = new int[4];
            for (int i = 0; i < 4; i++)
            {
                int randNum = rand.Next(min, max);

                while (column.Contains(randNum))
                {
                    randNum = rand.Next(min, max);
                }
                
                column[i] = randNum;
            }
            Array.Sort(column);
            return column;
        }
    }


}
