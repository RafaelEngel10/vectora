export const cmd = {
    print: (args: string) => {;
        console.log(args);
    },

    scan: (args: string) => {
        const variable: any = args[1]?.split(')')[0] ?? '';

        return variable;
    },

    search_storage: (args: string) => {
        if (args === '%%') {
            localStorage.getItem('count_');
        }
        localStorage.getItem(args);
        
    },

    storage: (args: string) => {
        const name = args.split(',')[0];
        const value = args.split(',')[1] || 'estocando vento...';

        localStorage.setItem(`${name}`, value);
    },

    clear_storage: (args: void) => {
        localStorage.clear();
        console.log('Armazenamento local excluído!');
    }
}