export const authHeader = () => {
    const userItem = localStorage.getItem('user');
    if (userItem) {
        const user = JSON.parse(userItem);
        if (user) {
            return user;
        }
    }

    return {};
}

export const authCookie = () => {
    const cookies = document.cookie.split(";");
    let output: string = '';
    cookies.forEach((cookie) => {
        const parts = cookie.split("=");
        if (parts.length === 2 && parts[0].trim() === "sharedstreets_token") {
            output = parts[1].trim();
        }
    });

    return output;
}