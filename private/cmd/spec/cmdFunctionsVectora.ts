
export const cmd = {
    print: (arg: string[]) => {
        const message: string = arg[1]?.split(')')[0] ?? '';

        console.log(message);
    },

    scan: (arg: string[]) => {
        const variable: any = arg[1]?.split(')')[0] ?? '';

        return variable;
    }
}