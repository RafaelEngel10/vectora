# What is Vectora? 

- Vectora is a project of an declarative DSL focused on orchestrating animations, designed specifically for the web-oriented frontend development ecosystem. Its main goal is to provide an expressive and simplified syntax for defining animated behaviors implemented through JavaScript.


# What is special about Vectora?

- Its main feature is to facilitate the use of animations, with a more user-friendly and readable syntax. Furthermore, there are incredible features to be explored that will be explained as the project expands. My goal is to bring more life to a world where most websites are static.

- It is worth highlighting that, in addition to its simplified syntax, Vectora is capable of creating new animations by combining pre-made animations, encouraging the use of creativity to contribute new animations to the community.


# How to use Vectora?

- In the **.html** file, it is necessary to declare two elements which will be fundamental for linking the Vectora file with the interpreter.

<pre>
    <*link* rel="vectora" href="~~.vec">            -- vectora file link
    <*script* src="vectora/interpreter.js"></*script*>    -- direct linking to interpreter
</pre>

- By that, now all you need to do is just to create an file with **.vec** extension.


# How to start with Vectora?

- Its syntax is simple and predictable:

<pre>
element/.class/#id {
    event.listener {
        property: animation(instructions); 
    };
}
</pre>

- First, declare the element that will be animated. Then, add the event that will be responsible for activating the animations when its condition equals true. Additionally, specify within the event which property will be animated.



