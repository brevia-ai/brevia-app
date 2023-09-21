<template>
    <main>
        <div class="mt-6  max-w-lg  mx-auto flex flex-col  space-y-4">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Register your account</h2>
                </div>
                <div class = "block text-sm text-gray-900 mx-12" v-if="registrationDone">
                    <p>A confirmation email has been sent to {{ userMail }}.</p>
                    <p>Check your inbox and follow the instructions to complete your registration</p>
                </div>
                <form action="#" ref="signupForm" method="POST" class="mx-12 mt-16 max-w-xl sm:mt-20">
                    <div class="grid  grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1">
                        <div class="sm:col-span-2">
                            <label for="first-name" class="block text-sm font-semibold leading-6 text-gray-900">First name <span class="text-red-400">*</span></label>
                            <div class="mt-2.5">
                                <input 
                                    v-model="firstName"
                                    type="text" 
                                    placeholder="Your name"
                                    required
                                    autocapitalize="none"
                                    autocorrect="off" 
                                    @focusout="activateSignupButton"
                                    class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6">
                            </div>
                        </div>
                        <div class="sm:col-span-2">
                            <label for="last-name" class="block text-sm font-semibold leading-6 text-gray-900">Last name <span class="text-red-400">*</span></label>
                            <div class="mt-2.5">
                                <input 
                                    v-model="lastName"
                                    type="text" 
                                    placeholder="Your last name"
                                    required
                                    autocapitalize="none"
                                    autocorrect="off"
                                    @focusout="activateSignupButton"
                                    class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6">
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="company" class="block text-sm font-semibold leading-6 text-gray-900">Email <span class="text-red-400">*</span></label>
                            <div class="mt-2.5">
                                <input
                                    v-model="userMail" 
                                    type="email" 
                                    placeholder="Your email eg: name.surname@email.com"
                                    required
                                    autocapitalize="none"
                                    autocorrect="off" 
                                    @focusout="checkUsername" 
                                    :class="beUserExist ? 'ring-red-500 ring-4' : 'ring-gray-300 ring-1' "
                                    class="block w-full border-0 rounded-md px-3.5 py-2 text-gray-900 shadow-sm ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                            <p class="text-red-600 text-sm font-bold" v-if="beUserExist">Username already in use</p>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Password <span class="text-red-400">*</span></label>
                            <div class="mt-2.5">
                                <input 
                                    v-model="userPass"
                                    :type="showPassword ? 'text' : 'password'" 
                                    placeholder="Enter the password"
                                    required 
                                    autocapitalize="none"
                                    autocorrect="off"
                                    @input="checkPassword" 
                                    class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6">
                            </div>
                            <div class="mx-2.5">
                                <input 
                                    type="checkbox"
                                    class="inline"
                                    @click="showPassword = !showPassword"
                                    >
                                <span class="inline text-sm ml-2">Show Password</span>
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Confirm Password</label>
                            <div class="mt-2.5">
                                <input 
                                    v-model="confrimPass"
                                    type="password" 
                                    placeholder="Confirm Password"
                                    required 
                                    autocapitalize="none"
                                    autocorrect="off" 
                                    @input="checkPassword"
                                    @focusin="pwdFocus = true"
                                    @focusout="pwdFocus = false"
                                    class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6">
                            </div>
                            <p class="text-red-600 text-sm font-bold" v-if="!passwordMatch && pwdFocus">Password do not match</p>
                        </div>
                    </div>
                    <div v-if="loading">...</div>

                    <div class="mt-10 mx-20">
                        <button 
                            type="submit" 
                            class="p-4 button w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
                            @click.prevent.stop="validateRegitration"
                            :disabled="!signupActive">
                            Sign up
                        </button>
                    </div>
                    <p class="text-center">Already have an account? <a class="text-sky-800" href="/auth" @click.prevent.stop="loginUser" >Sign in</a></p>
            </form>
        </div>
    </main>
</template>

<script>
    import { useStatesStore } from '~~/store/states';
    export default {
        data(){
            return{
                firstName: '',
                lastName: '',
                userMail: '',
                userPass: '',
                confrimPass: '',
                passwordMatch: false,
                signupActive: false,
                pwdFocus: false,
                showPassword: false,
                loading: false,
                registrationDone: false,
                beUserExist: false,
            }
        },
        methods:{
            async validateRegitration(){
                console.log("validating registration for " + this.firstName);
                this.loading = true;
                //Register user
                try {
                    const response = await fetch('/api/signup', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: this.firstName,
                            surname: this.lastName,
                            username: this.userMail,
                            password: this.userPass,
                            email: this.userMail
                        }),
                    });
                    const data = await response.json();
                    console.log(data.err)
                    //if the user 
                    if (data.err) {
                        if(data.err === 'be_user_exists'){
                            this.beUserExist = true;
                        }else{
                            this.error = `There has been an error\n${data.error}`;
                            console.log(data.err);
                            console.log(data);
                            
                        }
                    } else if (data) {
                        console.log("DATA:");
                        console.log(data);
                        this.registrationDone = true;
                    }
                } catch (error) {
                    console.log(error);
                } 
                this.loading = false;               
            },
            checkForm(){
                //Checks form validity to activate the signup button
                const signForm = this.$refs.signupForm;
                return [...signForm.querySelectorAll("input")].every(element => element.checkValidity());
            },
            checkUsername(){
                //TODO: Check if the email is already registered
                console.log("Checking if username is in use")
                this.activateSignupButton();
            },
            checkPassword(){
                //Check if password and confirm match
                if(this.userPass.length != 0 && this.confrimPass != 0){
                    if(this.userPass != this.confrimPass){
                        console.log("Password do not match");
                        this.passwordMatch = false;
                    }else{
                        console.log("Password do match");
                        this.passwordMatch = true;
                    }
                    this.activateSignupButton();
                }else{
                    this.signupActive = false;
                }
            },
            activateSignupButton(){
                //Activates the button id form is valid
                let isFormValid = this.checkForm();
                console.log("CheckForm: " + isFormValid);
                (isFormValid)?this.signupActive = true:this.signupActive = false;
            },
            loginUser(){
                const store = useStatesStore();
                store.userLogout();
            }
        }
    }
</script>