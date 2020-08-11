#include <stdio.h>

int main()
{
    int c;
    c = getchar();
    while (c != EOF)
    {
        int v = c != EOF;
        printf("value of condition %d", v);
        putchar(c);
        c = getchar();
    }
    return 0;
}
