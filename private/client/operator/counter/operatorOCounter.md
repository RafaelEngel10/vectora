## Counter

Counter in Vectora is called by (%%), it uses hidden local storage to keep counting numbers and verifying then every time;



### Common usage:

To count how many times a animation was called, returning TRUE if count number is even:

<pre>
h1 {
    window.onLoad {
        text: fall() %%;
    };
}
</pre>



### Count up to a specific number: 

Return TRUE when count number equals to a specific number:

<pre>
h1 {
    window.onLoad {
        text: fall() %%5;
    };
}
</pre>

> returns TRUE when counted number equals to 5.



### Ilimited Count:

Return TRUE every time that count number is divisible by a specific number:

<pre>
h1 {
    window.onLoad {
        text: fall() %%x5;
    };
}
</pre>

> returns TRUE when a counted number divided by 5 has a remainder of 0.