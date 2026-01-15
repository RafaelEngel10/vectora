O elemento assíncrono @cmd é um recurso diferente do convencional usado para executar ações básicas de qualquer linguagem de programação. Digo isso como printar mensagens no prompt de comando, escanear valores digitados no CMD e atribuir a variáveis, entre outras funções. 

Esse elemento por ser diferente, não funciona usar o parseVectora comum, algumas alterações terão que ser feitas, pois o elemento tem uma estrutura diferente. Aqui vai um simples exemplo de como a estrutura funciona:

###### dentro do arquivo .vec
<pre>
    @cmd {
        let idade = 0;

        print(`Digite sua idade: `);
        scan(idade);

        print(`Sua idade é ${idade}`);
        return;    
    }
</pre>

> Nesse código, os espaços em branco são ignorados claro, mas a estrutura é completamente diferente do que seria de por exemplo aplicar uma animação a uma tag.

---

Altere o parse.js com EXTREMO CUIDADO para adicionar essa feature sem que corrompa toda a estrutura da minha linguagem.