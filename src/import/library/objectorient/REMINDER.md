## HOW TO IMPORT:

<pre> 
    @async {
        import {
            objectorient
        }
    }
</pre>

## NOVOS COMANDOS:

-   Evento Assíncrono:
    - stem {...};
    - * Evento responsável pela filtração e definição de objetos Vectora.

    -  createObject(nome_do_objeto).
    - * Cria um objeto com nome definido no código.

    - nome_do_objeto = {
        ...
    }
    - * faz a implementação do conteúdo do objeto.

    -   searchObject(nome_do_objeto)
    - * faz a leitura e o uso do conteúdo do objeto.


## COMO USAR:

<pre>
    @async {
        stem {
            createObject(--cant-use);
            --cant-use = {
                text: shiver(sideways, 15px, 600);
                color: fadeColor(#f00, #000, 300);
            };
        };
    }

    h1 {
        onSing.click {
            value: searchObject(--cant-use);        <!-- Usa as duas propriedades presentes no objeto -->
        };
        onDbl.click {
            value: searchObject(--cant-use.text);       <!-- Usa apenas a propriedade de texto no objeto -->
        };
    }
</pre>