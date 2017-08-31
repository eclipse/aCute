using System;
using Xunit;

namespace Tests
{
    public class ProjectTestsFail
    {   
        [Theory] 
        [InlineData(3)] 
        [InlineData(4)] 
        [InlineData(5)] 
        [InlineData(6)]
        public void ReturnTrueGivenLessThan5(int value) 
        { 
      		Assert.True(value<5, $"{value} should be less than 5"); 
        }
    }
}