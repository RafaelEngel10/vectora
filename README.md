What is Vectora? 
--------------
Vectora is a declarative DSL project focused on orchestrating animations, designed specifically for the web-oriented frontend development ecosystem.

What it solves
--------------
Many JS animations become hard to maintain due to imperative state management and scattered event handlers.  
Vectora provides a declarative syntax to describe animations in a structured, readable DSL, reducing boilerplate and cognitive load.

Getting Started
---------------
***Clone Repository:*** <br>
git clone https://github.com/RafaelEngel10/vectora.git <br>
cd vectora <br>

***Install Dependencies:***<br>
npm install <br>

***Run build:***<br>
npm run build <br>

Grammar Example
-------
Create `example.vec`:
<pre>
div {
    window.onLoad {
        background.color: fadeIn(#fff00, 600ms);
    };
}
</pre>

Add to `index.html`:
<pre>
<*link* rel="vectora" href="example.vec">
<*script* src="./vectora/src/interpreter.js">
</pre>

> interpreter is executed on page load

Syntax Breakdown
---
<pre>
div {                                                          <--- HTML element/class/id
    window.onLoad {                                             <--- Animation Trigger Event
        background.color: fadeIn(#fff00, 600ms);                  <--- Property: Animation function
    };
}
</pre>

Design Decisions
----------------
Vectora was designed as a DSL because it is a formal system with well-defined rules and symbols that provide clear instructions to the computer. This language has more to offer than just a basic CSS-style declaration. Based on these criteria, it was determined that it could not be anything other than what it already is.

Status
------
Current: core DSL and basic animations working  
In progress: sum and concat animations, executable commands on @cmd tag.  
Planned: conditional statement, loop while.

Contributing
------------
1. Open an issue
2. Fork and branch
3. Make changes + tests
4. Open pull request


more info about in our site: <---!work in progress!--->