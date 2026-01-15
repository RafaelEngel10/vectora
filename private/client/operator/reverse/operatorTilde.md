## Reverser

Reverser in Vectora is called by (~~), it reverts original animation into an animation opposite to the main one;



### Common usage:

To revert an animation, uses before it, like this

<pre>
h1 {
    window.onLoad {
        text: ~~land();
    };
}
</pre>



### Revert sum animations:

<pre>
h1 {
    window.onLoad {
        text: land() ++ slideIn() => ~~;
    };
}
</pre>