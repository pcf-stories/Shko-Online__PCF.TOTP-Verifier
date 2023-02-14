import { IInputs, IOutputs } from "./generated/ManifestTypes";

import { authenticator as totp} from "otplib";

export class TOTPVerifier
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
  {
    private _container: HTMLDivElement;
    private div1: HTMLDivElement;
    private div2: HTMLDivElement;
    private form: HTMLDivElement;
    private button: HTMLButtonElement;
    private inputHidden: HTMLInputElement;
    private token: string;
    private secret: string;
    constructor() {}
  
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework this the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data this persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
      context: ComponentFramework.Context<IInputs>,
      notifyOutputChanged: () => void,
      state: ComponentFramework.Dictionary,
      container: HTMLDivElement
    ): void {
      this._container = container;
      this.secret = context.parameters.Secret.raw || "";
  
      this.div2 = document.createElement("div");
      this.div2.setAttribute("class", "flex flex-row w-full h-full");
      this.div2.setAttribute("id", "OTPInput");
  
      for (let i = 0; i < 6; i++) {
        const inputField = document.createElement("input");
        inputField.setAttribute(
          "class",
          "w-full h-full justify-self-stretch h-auto bg-gray-100 border-gray-100 outline-none focus:bg-gray-200 text-center rounded focus:border-blue-400 focus:shadow-outline"
        );
        inputField.setAttribute("id", "otp-field");
        inputField.setAttribute("type", "number");
        inputField.style.cssText = "color: transparent; text-shadow: 0 0 0 gray;";
        inputField.maxLength = 1;
        inputField.style.fontSize="400%"
        inputField.style.margin= "1px"
        inputField.max = "9";
        inputField.min = "0";
        (inputField.required = true), this.div2.appendChild(inputField);
      }
  
      this.inputHidden = document.createElement("input");
      this.inputHidden.setAttribute("id", "otp");
      this.inputHidden.setAttribute("name", "otp");
      this.inputHidden.hidden = true;
  
      this.button = document.createElement("button");
      this.button.setAttribute("type", "button");
      this.button.setAttribute(
        "class",
        "mt-10 button button-primary font-bold text-lg px-6 pt-3 pb-3 rounded bg-black text-white"
      );
      this.button.setAttribute("id", "otpSubmit");
      this.button.innerHTML = "Submit";
  
      this.form = document.createElement("div");
      this.form.setAttribute("class", "w-full h-full flex flex-col justify-between")
      this.form.appendChild(this.div2);
   
      this.form.appendChild(this.inputHidden);
  
  
      this.div1 = document.createElement("div");
      this.div1.style.height= "100%"
      this.div1.setAttribute("class", "w-full h-full flex flex-col justify-center text-center items-center content-around");
      this.div1.appendChild(this.form); 
      this.div1.appendChild(this.button);
  
  this. _container.style.height= "100%"
      this._container.appendChild(this.div1);
  
      const inputs =
        document.querySelectorAll<HTMLInputElement>("#OTPInput > *[id]");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("keydown", (evt) => {
          const event = evt as KeyboardEvent;
          if (event.key === "Backspace") {
            if (inputs[i].value == "") {
              if (i != 0) {
                inputs[i - 1].focus();
              }
            } else {
              inputs[i].value = "";
            }
          } else if (event.key === "ArrowLeft" && i !== 0) {
            inputs[i - 1].focus();
          } else if (event.key === "ArrowRight" && i !== inputs.length - 1) {
            inputs[i + 1].focus();
          } else if (event.key ==="Enter"){
              this.check(context);
          }
          else if (event.key != "ArrowLeft" && event.key != "ArrowRight") {
            inputs[i].setAttribute("type", "number");
            inputs[i].value = "";
          }
        });
        inputs[i].addEventListener("input", function () {
          inputs[i].value = inputs[i].value.toUpperCase(); 
          if (i === inputs.length - 1 && inputs[i].value !== "") {
            return true;
          } else if (inputs[i].value !== "") {
            inputs[i + 1].focus();
          }
        });
      }
  
      this.button.addEventListener("click", (evt) => {
       this.check(context)
        evt.preventDefault();
      });
    }
  
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
      // Add code to update control view
      this.secret = context.parameters.Secret.raw || "";
    }
  
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
      return {};
    }
  
 
    public destroy(): void {
    }
    public check(context: ComponentFramework.Context<IInputs> ): void{
        const inputs =
          document.querySelectorAll<HTMLInputElement>("#OTPInput > *[id]");
        let compiledOtp = "";
        for (let i = 0; i < inputs.length; i++) {
          compiledOtp += inputs[i].value;
          inputs[i].value = ''
        }
        inputs[0].focus();
        this.inputHidden.value = compiledOtp;
        this.token = compiledOtp;
        const tokenCheck = totp.check(this.token, this.secret);
        Object.getOwnPropertyNames(
          context.parameters.verifierDataSet.records
        ).forEach((recordId) => {
          if (
            context.parameters.verifierDataSet.records[recordId].getValue(
              "Success"
            ) === (tokenCheck)
          ) {
            const entityReference: ComponentFramework.EntityReference =
              context.parameters.verifierDataSet.records[
                recordId
              ].getNamedReference();
            context.parameters.verifierDataSet.openDatasetItem(entityReference);
          }
        });
  
     
    }
  }
  