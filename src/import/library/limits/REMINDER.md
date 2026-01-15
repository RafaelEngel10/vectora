## HOW TO IMPORT:

<pre>
    @vectora {
        import {
            limits
        };
    }
</pre>


## New property:

- request: ; ---> propriedade de requisição (Explicação mais detalhada na seção de "Limites responsivos").


## Responsive Limits =

- Através da propriedade de requisição, é possível definir quantas vezes a animação vai repetir, além de definir limites de quantas vezes a animação poderá ser repetida.

- Os possíveis valores para essa propriedade são:
    - **callDismiss(número de tolerância)** ---> permite a repetição da mesma animação por um número de vezes tolerado. Sem parâmetro, trava a animação na hora.

    - **callBack(sem parâmetro)** ---> permite que uma vez feita a animação, ao ser chamada novamente, vai fazer o seu inverso.

    - **callAwait(sem parâmetro)** ---> repete as mesmas animações até que o gatilho do evento dispare novamente. Basicamente um loop coletivo.