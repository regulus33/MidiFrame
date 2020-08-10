#include <stdio.h>

/* print Fahrenheit-Celsius table for fahr = 0, 20, ..., 300 */
main()
{
    float fahr, celsius;
    float lower, upper, step;
    lower = 0.0;
    upper = 100.0;
    step = 5.0;
    /* lower limit of temperature scale */ /* upper limit */
    /* step size */
    celsius = lower;
    printf("Celsius Fahrenheit\n");
    while (celsius <= upper)
    {
        fahr = celsius * (9.0 / 5.0) + 32;
        printf("%3.0f %10.1f\n", celsius, fahr);
        celsius = celsius + step;
    }
}
