## Propriedades Vectora:

- text: ;  ---> propriedade referente ao texto do elemento.

- color: ; ---> propriedade referente a cor do elemento.

- transform: ; ---> propriedade geral que mantém o efeitos finais de animações.

- radius: ; ---> propriedade referente ao raio de curvatura de um elemento.

- gap: ; ---> propriedade referente a distância entre dois elementos ou mais.

- weight: ; ---> propriedade referente ao peso de um texto de um elemento.

- brightness: ; ---> propriedade referente a claridade de um elemento.

- shadow: ; ---> propriedade referente a simulação de sombra de um elemento.

- value: ; ---> propriedade de valor (Explicação mais detalhada na seção de "Eventos assíncronos").


## Animações Vectora: 

- [x] text ==
    - fall(duração) ---> animação de queda suave do texto.

    - rise(duração) ---> animação de subida suave.

    - slideIn(origem, distância, duração) ---> animação de deslize do texto.

    - slideOut(sentido, distância, duração) ---> animação de deslize para fora.

    - fadeIn(duração) ---> animação de surgimento.

    - fadeOut(duração) ---> animação de desaparecimento.

    - pop(intensidade, duração) ---> animação de explosão.

    - implode(intensidade, duração) ---> animação de implosão.

    - shiver(intensidade, duração) ---> animação de tremedeira.

    - shake(direção, intensidade, duração) ---> animação que depende da direção que pode ser até 3 tipos ==
        - "seesaw": "gangorra" -> diagonal; 
        - "cocktail-shaker": "coqueteleira" -> vertical;
        - "sideways": "laterais" -> horizontal;
    
    - spin(sentido, graus, duração) ---> rotaciona o texto através de um sentido, horário ou anti-horário, em uma certa duração.

- [x] color == 
    - fadeColor(cor final, duração) ---> animação de aparecimento da cor

    - chameleonCamo(cor final, duração) ---> animação de troca de cor, de dentro para fora.

    - octopusCamo(cor final, duração) ---> animação de troca de cor, de fora para dentro.

    - paint(sentido, cor final, duração) ---> colore conforme a sentido.

    - liquidFill(sentido, cor final, duração) ---> colore como se estivesse enchendo de algum líquido.

- [x] transform ==
    - rotate(sentido, intensidade, duração) ---> rotaciona o texto através de um sentido, horário ou anti-horário, em uma certa duração, perdurando sua posição.

    - zoomIn(intensidade, duração) ---> aproxima o elemento, perdurando a animação. 

    - zoomOut(intensidade, duração) ---> afasta o elemento, perdurando a animação.

    - mirror(intensidade, duração) ---> inverte e espelha o elemento.

- [x] radius ==
    - round(intensidade, duração) ---> muda do estado inicial de border-radius para o estado final com uma transição simples.

    - corner(borda específica, intensidade, duração) ---> arredonda um canto específico em um certo período de tempo.

- [x] gap ==
    - bloom(gap final, duração) ---> transita do gap inicial para o final sem preferência.

    - stagedBloom(sentido (vertical/horizontal), duração) ---> transita do gap inicial para o final com preferência referenciada.

- [ ] weight ==
    - skinny(escala, duração) ---> multiplica o peso da fonte pela escala em porcentagem.
    
    - heavy(escala, duração) ---> divide o peso da fonte pela escala em porcentagem.

- [ ] brightness ==
    - halo(intensidade, cor, duração) ---> cria uma luz envolta do texto.

    - fadeLight(intensidade original, duração) ---> desfaz uma luz envolta do texto.

    - neon(cor, direção, intensidade) ---> cria uma luz neon no texto dependendo da direção.

    - pillar(cor, intensidade) ---> cria um pilar de luz.

- [x] shadow ==
    - surge(direção, intensidade, duração) ---> cria uma sombra dependendo da direção, com intensidade definida.

    - fadeDusk(duração) ---> desfaz uma sombra em certo tempo.

    - purge(duração) ---> rotaciona a sombra para o lado oposto ao seu.

- [ ] value == 
    - proposeValue(nome da variável root) ---> cria um objeto que guarda propriedades pré-estabelecidas.

    - searchValue(nome da variável root) ---> executa as animações presentes no objeto.



##  Eventos Vectora:

- [x] DOMContent.onLoad ==
    Assim que o DOM for carregado, realiza uma animação.

- [x] window.onLoad ==
    Assim que a página for totalmente carregada, a animação acontece.

- [x] reveal.onScroll ==
    Realiza a animação assim que for revelado pelo scroll lateral da página.

- [x] onSing.click == 
    Executa a animação ao clicar uma vez em cima do elemento.

- [x] onDbl.click ==
    Executa a animação com um clicar duplo em cima do elemento.

- [x] onHold.click ==
    Executa a animação com o segurar de um clique.

- [ ] hide.onScroll ==
    Assim que escondido pelo scroll, realiza uma animação.

- [ ] onFocus.hold ==
    Quando o elemento é focado, realiza a animação.

- [ ] onSelection.hold ==
    Quando um elemento é selecionado, realiza a animação.


##  Soma e Concatenação de Animações =

- No Vectora, é possível realizar a soma ou a concatenação de animações. A soma de duas ou mais animações ocorre apenas quando são de famílias diferentes. Já a concatenação ocorre em espécimes de mesma família.

> Precisa fazer um filtro com switch/case que filtra quais famílias pertencem cada animação, sendo necessário a comparação das famílias para saber se são iguais ou diferentes.

* Ambas simbolizadas pelo (++).


### Soma =

- Na soma de animações, ocorre a junção das propriedades de cada, formando uma nova interpolação sem nome. Isso pode ser explicado utilizando vetores da *Física*. Imagine duas setas, ambas apontando para o mesmo centro, mas uma é totalmente horizontal e a outra é totalmente vertical. Ao somar essas duas, você consegue uma resultante diagonal com 45° ângulares. Essas setas são as movimentações e a resultante é nada mais que a soma dessas mesmas.

<pre>exemplo {
    window.onLoad {
        text: fall() ++ slideIn();
    };
} </pre>


### Concatenação =

- Durante uma concatenação, as animações são colocadas em sequência sem intervalo de tempo entre uma e outra. Pode-se usar como exemplo a concatenação das animações:

<pre>exemplo {
    window.onLoad {
        text: slideIn() ++ slideOut();
    };
}</pre>

- A animação slideIn é executada primeiro e, ao seu término, a segunda é executada imediatamente.


### Concatenação Induzida =

- A concatenação de animações de famílias diferentes em uma é feita através de um símbolo universal. Esse símbolo representa que, a função antes e depois serão postas em sequência e não somadas.

> O símbolo de concatenação induzida é: +-

<pre>exemplo {
    window.onLoad {
        text: slideIn +- rise();
    };
} </pre>


## Manipulação de Interpolação =

- Uma interpolação nada mais é que o resultado obtido da soma/concatenação de duas ou mais animações. Suas propriedades podem ser livremente manipulados, bastando apenas seguir uma síntaxe indicadora.

<pre>exemplo {
    window.onLoad {
        text: fall() ++ slideIn() => ;
    };
}</pre>

- Sendo assim, com o indicador ( => ) é possível definir qual será a animação que vai executar ao final da interpolação:

<pre>exemplo {
    window.onLoad {
        text: fall() ++ slideIn() => fadeOut();   
    };
}</pre>

* Ao final da interpolação, em sequência, a animação de fadeOut será executada.

- Além disso, é possível definir propriedades à interpolação, através do símbolo de (&). Sendo necessário o juste da posição de propriedade para antes de qualquer animação.

<pre>exemplo {
    window.onLoad {
        text: fall() ++ slideIn() => &ease-in => fadeOut();   
    };
}</pre>



#### Intervalos na Execução = 

- Através de um símbolo especial, é possível definir o intervalo de tempo entre a execução da primeira e segunda animação concatenada, sendo necessário colocar o valor em ms (milissegundos).

> Reforçando que o símbolo é o (--)

<pre>exemplo {
    window.onLoad {
        text: slideIn +- rise() => --1000ms;
    };
} </pre>




##  Eventos Assíncronos =
    
* Eventos assíncronos nada mais são do que eventos que não necessitam de uma condição para ser executado. O melhor exemplo disso é o evento **@async**, o qual é um evento que permite a inicialização de variáveis.

<pre>
@async {
    root {
        proposeValue(--deny-text) = fadeColor( #f00, #000, 600);
    };
}
</pre>

- Outros eventos assíncronos a serem citados:
    - *media* ---> aplica animações conforme o tamanho da tela do usuário.

    - *import* ---> importa aplicações e outras bibliotecas.

    - *charset* ---> define a codificação do arquivo.

    - *layer* ---> cria uma camada de ordem de prioridade entre blocos.




