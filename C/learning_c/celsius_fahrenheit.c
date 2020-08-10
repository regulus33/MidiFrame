#include <stdio.h>

/* print Fahrenheit-Celsius table for fahr = 0, 20, ..., 300 */
main()
{
    float fahr, celsius;
    float lower, upper, step;
    lower = 0.0;
    upper = 300.0;
    step = 20.0;
    /* lower limit of temperature scale */ /* upper limit */
    /* step size */
    fahr = lower;
    printf("Fahrenheit   Celsius\n");
    while (fahr <= upper)
    {
        celsius = (5.0 / 9.0) * (fahr - 32.0);
        printf("%3.0f %15.1f\n", fahr, celsius);
        fahr = fahr + step;
    }
}
