Leia code.md

O código presente dentro desse arquivo tem como função parsear uma estrutura específica em um objeto Javascript:

//bloco retornado
<pre>
selector: any;
    events: {
        name: any;
        actions: {
            prop: string;
            value: string;
        }[];
    }[];
</pre>

//bloco original
<pre>
selector {
    event.trigger {
        property: value;
    };
}
</pre>

Agora, eu quero que você faça um código que parsear e retorna uma estrutura específica assim:

<pre>
selector {                     
    $idade = 10;                    //comandos básicos como variáveis
    print(idade);                   //output de dados
    return;                         //retorno
}
</pre>

