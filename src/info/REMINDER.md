#                                                               **OUTDATED**

## new root async event Vectora:
- Usualy used to declare constants when a certain animation is used too many times. 

    -- declareting ::

        @vectora {
            root.Event {
                proposeValue(${rejection-animation}) {
                    text: shake(sideways, 0.75px, 600);
                    color: fadeColor( #ff0000, 500);
                };
            }
        }


    -- using ::

        h1 {
            window.onLoad {
                value: searchValue(${rejection-animation});
            }
        }



## events to make:

    hide.onScroll {
        ---> hide from scroll when not seen                  
    }

    onFocus.hold {
        ---> when focusing on smthg, like 'Tab', do some other thing
    }

    onSelection.hold {
        ---> when u click and move mouse so can create a blue outline, do smthg about it
    }

    when.Hover {
        ---> when u hover onto element
    }

    when.Target {
        ---> when target by a link or anchor, do smthg
    }

    when.Check {
        ---> checkbox like when cheked, do stmg
    }

    when.Disabled {
        ---> when disabled, do smthg
    }

    when.Enabled {
        ---> when enabled, do smthg
    }



# on( Sing/Dbl/Hold ).click 
## event special functions:

    create(initial state, final state, auxiliar function) ---> start at display: none, transits to display: block, while auxiliar function animates, those functions can be 
    land() / rise() / etc. Used to create opeennable menus.



## next text functions: 

    shake(direction, intensity, duration) ---> shake text, can be directioned to 'sideways' / 'cocktail-shaker' / 'seesaw'                        #DONE

    shiver(intensity, duration) ---> shiver text, can apply intensity and duration                                #DONE                                                      



## next color functions:

    chameleonCamo(original color, final color, duration) ---> color change inner outer                               #DONE       

    octopusCamo(original color, final color, duration) ---> color change outer inner                                  #DONE

    paint(direction, original color, final color, duration) ---> color change depends on direction, can be 'left' / 'right' / 'top' / 'bottom'            #DONE

    ----> background-color can use same functions as color can, keep in mind that it is a syntaxe purpose only.



## new radius functions:

    round(estado inicial, estado final, duração) ---> muda do estado inicial de border-radius para o estado final com uma transição simples.



## new gap functions: 

    bloom(gap inicial, gap final, duração) ---> transita do gap inicial para o final sem preferência.

    stagedBloom(sentido (vertical/horizontal), duração) ---> transita do gap inicial para o final com preferência referenciada.



## new weight functions:

    skinny(scale, duration) ---> multiplies weight by scale 

    heavy(scale, duration) ---> divides weight by scale



## new message property functions:
    
    alert("Message written here", duration) ---> creates a message innerHtml with a certain duration



## new brightness property functions:

    halo(intensity, duration) ---> creates an brilliant light surrounding the text

    neon(set color, direction, intensity) ---> creates a neon 
    
    pillar(cor, intensidade) ---> cria um pilar de luz.



## new request property functions:  

    callDismiss(número de tolerância) ---> permite a repetição da mesma animação por um número de vezes tolerado.

    callBack(sem parâmetro) ---> permite que uma vez feita a animação, ao ser chamada novamente, vai fazer o seu inverso.

    callAwait(sem parâmetro) ---> repete a mesma animação até que o gatilho do evento dispare novamente.



## new value property functions:

    proposeValue(root variable) ---> set value to a variable

    searchValue(root variable) ---> uses variable value