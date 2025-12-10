# Oque é o Vectora?

- Vectora constitui uma linguagem de domínio específico declarativa, voltada à estilização e orquestração de animações, concebida especificamente para o ecossistema de desenvolvimento frontend voltado à Web. Seu principal propósito consiste em proporcionar uma sintaxe expressiva e simplificada para a definição de comportamentos animados tradicionalmente implementados por meio de JavaScript, permitindo ao desenvolvedor descrever transições, transformações e interações visuais de maneira mais intuitiva e coesa.

- Diferenciando-se das abordagens convencionais de estilização e animação, o Vectora foi projetado para oferecer maior flexibilidade semântica e criativa, possibilitando um nível mais elevado de controle sobre a temporalidade, a fluidez e a composição dos efeitos dinâmicos aplicados à interface. Essa característica confere à linguagem uma notável capacidade de abstrair a complexidade dos mecanismos subjacentes de renderização e execução, ao mesmo tempo em que preserva a legibilidade e a modularidade do código.

- Em suma, o Vectora propõe-se como uma camada intermediária entre o design declarativo previsível e a lógica imperativa, consolidando-se como uma solução inovadora para a definição de animações e interações web com ênfase na clareza sintática, extensibilidade e liberdade criativa do desenvolvedor.


## O que há de especial no Vectora?

- Sua principal característica é facilitar o uso de animações, com uma sintaxe mais amigável e legível. Além disso, há características íncriveis a serem exploradas que serão explicadas conforme a idéia do projeto se amplia. Meu objeto com isso é incentivar a criatividade e animar mais um mundo onde a maioria dos sites são estáticos.

- Vale ressaltar que, além da sua sintaxe simplificada, o Vectora é capaz de criar novas animações através da junção de animações pré-moldadas, estimulando o uso da criatividade para atribuir novas animações para a comunidade.


## Como usar o Vectora?

- No principal arquivo de .html, é necessário declarar dois elementos os quais serão fundamentais para linkar o arquivo do Vectora, com o interpretador.

<pre> 
    <*link rel="stylesheet" href="styles.vec">     <!-- Arquivo de extensão Vectora -->
    <*script src="./vec-modules/interpreter.js">        <!-- Arquivo principal de execução da interpretação -->
</pre>

## Como funciona sua sintaxe?

- Sua sintaxe é simples e previsível:

<pre>elemento/.classe/#id { 
    evento.ativador{
        propriedade-especíica: animação(instruções); 
    };
}  </pre>

- Primeiro se declara o elemento que será feito a animação. Em seguida, coloque o evento o qual vai ser responsável por ativar as animações quando sua condição de ocorrência for verdade. Além disso, é instruido dentro do evento a propriedade que vai ser feita a animação.


## Como funciona sua gramática?

### Léxico:

- A gramática da coisa é levada em conta cada "{}", sendo que para os eventos, é necessário colocar ";" na fecha-chave para diferenciar cada um. A leitura do arquivo é feita linha por linha, da esquerda para direita.

- Toda propriedade representa a parte do elemento a qual vai ser manipulada, sendo sempre seguida de ":" para sua manipulação. Sendo assim, é atribuindo para essa propriedade, oque a animação vai fazer. Além disso, toda animação precisa de "()", já que são nada mais que funções com parâmetros atribuíveis que passam instruções de como vão ser executadas.

### Precedência e associatividade dos operadores:

- Acima de tudo, os símbolos (++ e +-) são os primeiros a serem levados em conta, logo após a mudança na propriedade da interpolação, vulgo junção das animações, em seguida o delay entre cada animação (--) e por último, mas não menos importante, a atribuição de propriedade (&), a qual sempre é antecedida pelo sinal universal de interpolação (=>);

<pre>
    fall() ++ slideIn() => &ease-in;
</pre>

- Através dessa simples soma de animações, é possível deduzir que a interpolação será um vetor diagonal com uma curva suave até o ponto de chegada. Além disso, através do sinal universal de interpolação, pode-se definir uma animação que será executada em sequência, segue o exemplo abaixo:

<pre>
    fall() ++ slideIn() => &ease-in => slideOut(right,2px,300ms) => --500ms;
</pre>