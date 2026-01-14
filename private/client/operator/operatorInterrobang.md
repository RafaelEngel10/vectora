## Conditional Structure ELSE IF

Vectora's Else If Statement is called by (!?).


### Usage:

Used in conjunction with the If (??), being very similar to a common Vectora property. The ":" represents a single action if the condition is true. For joint actions, the "{}" is used.

<pre>
h1 {
    window.onLoad {
        text: fall() %%5;
        ?? %%==5: rise() !? %%==6: slideIn();
    };
}
</pre>

---

<pre> 
h1 {
    window.onLoad {
        text: fall() %%5;
        ?? %% == 5 {
            text: slideOut();
            color: fadeColor();
        } !? %% == 6 {
            text: rise();
            color: chameleonCamo();
        };
    };
}
</pre>

> The use of ";" is mandatory on !! statement.