using System;
using Xunit;
namespace Tests
{
    public class ProjectTestsPass
    {   
        [Theory] 
        [InlineData(1)] 
        [InlineData(2)] 
        [InlineData(3)]
        public void ReturnTrueGivenLessThan4(int value) 
        { 
      		Assert.True(value < 4, $"{value} should be less than 4"); 
        }
    }
}