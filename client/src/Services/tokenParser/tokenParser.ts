interface IToken {
    login: string;
    channel: string;
    ID: string;
}

export const tokenParser = function(token: string): IToken {
    const jsonString = window.atob(token);
    return JSON.parse(jsonString)
};