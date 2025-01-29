using System;
using BCrypt.Net;

namespace PasswordHasherApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter password to hash: ");
            string plainPassword = Console.ReadLine();

            // Hash the password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);

            Console.WriteLine($"Hashed Password: {hashedPassword}");
            Console.WriteLine("Copy this hashed password and update your database.");
            Console.ReadLine();
        }
    }
}
