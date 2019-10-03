

exports.contactFormTemplate = (context) => {
    firstDiv = 'background:#f4f7f4'
    const html = `
        <div style="${firstDiv}">
            <div style="padding: 10px">
                <p>${context.message}</p>    
                <br />
                <p>Again my name is ${context.name}, you can contact me on ${context.email} </p>
            </div>
            
        </div>
    `
    return html
}
