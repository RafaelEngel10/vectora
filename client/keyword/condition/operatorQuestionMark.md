## Conditional Structure IF

Vectora's If Statement is called by (??).


### Usage:

Used in conjunction with the Counter (%%), being very similar to a common Vectora property. The ":" represents a single action if the condition is true. For joint actions, the "{}" is used.

<pre>
h1 {
    window.onLoad {
        text: land() %%5;
        ?? %%==5: land();
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
        };
    };
}
</pre>

> The use of ";" is mandatory if there is no else statement immediately following it.