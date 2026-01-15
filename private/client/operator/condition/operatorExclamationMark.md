## Conditional Structure ELSE

Vectora's Else Statement is called by (!!).


### Usage:

Used in conjunction with the If (??), being very similar to a common Vectora property. The ":" represents a single action if the condition is true. For joint actions, the "{}" is used.

<pre>
h1 {
    window.onLoad {
        text: land() %%5;
        ?? %%==5: rise() !!: land();
    };
}
</pre>

---

<pre> 
h1 {
    window.onLoad {
        text: land() %%5;
        ?? %% == 5 {
            text: slideOut();
            color: fadeColor();
        } !! {
            text: land();
            color: paint();
        };
    };
}
</pre>

> The use of ";" is mandatory on !! statement.