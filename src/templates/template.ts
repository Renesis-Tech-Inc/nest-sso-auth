export const template = (body: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>SSO-Auth</title>
	<meta name="description" content="">
	<link rel="icon" href="https://SSO-Auth-ai.s3.amazonaws.com/favicon" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
</head>
  <style>
      * {
          margin: 0%;
          padding: 0%;
      }
  </style>
  
  <body style="box-sizing: border-box;margin: 0%;padding: 0%; font-family: jost;background-color: #fff;">
      ${body}
  </body>

  </html>`;
};
