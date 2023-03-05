# TOTP Verifier
This component can verify the TOTP code when you configure the secret. It should add a level of security to your app in offline mode.

To use the component follow these steps:

- Import the managed solution into your environment
- Configure the component in you Canvas App
    - You can set the items like the following: `Table({Success: true, Message: "You entered the right password"}, {Success: false, Message: "The password is incorrect. Please try again"})`
    - You can use the OnSelect property to act on the password submissions: `If( TOTPVerifier1.Selected.Success, Navigate(SecretRoomScreen), Set(WrongSecretMessage, TOTPVerifier1.Selected.Message))`
- Enjoy!

This is a demo of the component:

https://user-images.githubusercontent.com/11160171/222982652-405e3ea3-084d-436d-82f5-c2e2b21d4d1c.mp4

What does the solution contain?

<img width="901" alt="image" src="https://user-images.githubusercontent.com/11160171/222984593-ba853ff7-6b12-483d-8d57-268f2a7d5168.png">

What does the configuration look like in a Canvas App?

<img width="652" alt="image" src="https://user-images.githubusercontent.com/11160171/222984638-99d0363f-79b0-47b7-a602-06675b7a87a1.png">

If you would like to build components with this kind of quality, get in touch with us.
