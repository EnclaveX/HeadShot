<template>
	<v-app id="inspire" class="principal">
		<v-content class="content">
			<div class="d-flex">
				<v-toolbar class="app-toolbar d-flex flex-row-reverse">
					<v-toolbar-items>
						<v-select :items="langs" v-model="lang"></v-select>
					</v-toolbar-items>
				</v-toolbar>
			</div>
			<v-img class="d-flex background">
				<v-row :class="'painel d-flex justify-center align-content-center mb-6'" flat tile>
					<v-form :class="'form'">
						<div
							class="login-title"
						>{{ showSignup ? this.$i18n.t('headshot.principal.register') : this.$i18n.t('headshot.principal.login') }}</div>
						<v-text-field
							v-if="showSignup"
							:label="this.$i18n.t('headshot.principal.name')"
							hide-details="auto"
							v-model="user.name"
						></v-text-field>
						<v-text-field
							:label="this.$i18n.t('headshot.principal.email')"
							hide-details="auto"
							v-model="user.email"
						></v-text-field>
						<v-text-field
							v-if="!showSignup"
							v-model="user.password"
							:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
							:type="showPassword ? 'text' : 'password'"
							name="password"
							:label="this.$i18n.t('headshot.principal.password')"
							:hint="this.$i18n.t('headshot.principal.msgMinCharacters', {1: 8})"
							counter
							@click:append="showPassword = !showPassword"
						></v-text-field>
						<v-text-field
							v-else
							v-model="user.password"
							:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
							:rules="[rules.required, rules.min]"
							:type="showPassword ? 'text' : 'password'"
							name="password"
							:label="this.$i18n.t('headshot.principal.password')"
							:hint="this.$i18n.t('headshot.principal.msgMinCharacters', {1: 8})"
							counter
							@click:append="showPassword = !showPassword"
						></v-text-field>
						<v-text-field
							v-if="showSignup"
							:label="this.$i18n.t('headshot.principal.confirmPassword')"
							v-model="user.confirmPassword"
							:append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
							:rules="[rules.required, rules.min]"
							:hint="this.$i18n.t('headshot.principal.msgMinCharacters', {1: 8})"
							counter
							@click:append="showConfirmPassword = !showConfirmPassword"
							:type="showConfirmPassword ? 'text' : 'password'"
						></v-text-field>
						<v-col class="d-flex justify-center align-content-center">
							<v-btn
								v-if="showSignup"
								class="purple darken-1"
								dark
								@click="signup"
							>{{ $i18n.t('headshot.principal.signup')}}</v-btn>
							<v-btn
								v-else
								color="purple darken-1"
								dark
								@click="signin"
							>{{this.$i18n.t('headshot.principal.signin')}}</v-btn>
						</v-col>
						<v-col class="text-center" @click.prevent="showSignup = !showSignup">
							<div class="my-2">
								<v-btn v-if="showSignup" text small>{{this.$i18n.t('headshot.principal.msgUserRegistered')}}</v-btn>
								<v-btn v-else text small>{{this.$i18n.t('headshot.principal.msgUserNotRegistered')}}</v-btn>
							</div>
						</v-col>

						<div class="cooprights">
							<h5 class="cooprights">{{this.$i18n.t('headshot.principal.cooprights')}}</h5>
						</div>
					</v-form>
				</v-row>
			</v-img>
		</v-content>
	</v-app>
</template>

<script>
	import { baseApiUrl, showError, userKey } from "@/global";
	import { mapActions } from "vuex";
	import axios from "axios";

	export default {
		name: "login",
		components: {},
		metaInfo: {
			title: "HeadShot - The Betbot"
		},
		data: function() {
			return {
				showSignup: false,
				user: {},
				showPassword: false,
				showConfirmPassword: false,
				lang: "pt",
				langs: [
					{ text: "Português", value: "pt" },
					{ text: "English", value: "en" }
				],
				rules: {
					required: value =>
						!!value || this.$i18n.t("headshot.principal.msgRequired"),
					min: value => {
						if (value) {
							if (value.length >= 8) {
								return true;
							} else {
								return this.$i18n.t("headshot.principal.msgMinCharacters", {
									1: 8
								});
							}
						} else {
							return true;
						}
					}
				}
			};
		},
		methods: {
			...mapActions("users", ["setUser"]),
			signin() {
				axios
					.post(`${baseApiUrl}/signin`, this.user)
					.then(res => {
						this.setUser(res.data);
						localStorage.setItem(userKey, JSON.stringify(res.data));
						this.$router.push({ path: "/" });
					})
					.catch(showError);
			},
			signup() {
				axios
					.post(`${baseApiUrl}/signup`, this.user)
					.then(() => {
						this.$toasted.global.defaultSuccess();
						this.user = {};
						this.showSignup = false;
					})
					.catch(showError);
			}
		},
		watch: {
			lang(value) {
				localStorage.setItem("HeadShotLocale", value);

				this.$i18n.locale = value;
			}
		},
		created(){
			this.$i18n.locale = localStorage.getItem("HeadShotLocale");
			this.lang = this.$i18n.locale;
		}
	};
</script>

<style>
	.principal {
		min-height: 100vh;
	}

	.background {
		background-image: url("D:/Program/HeadShot/FrontEnd/headshotvue/src/assets/background-login.png");
		background-size: cover;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}

	.form {
		background-color: rgba(255, 255, 255, 0.85);
		padding: 20px;
		border-radius: 5px;
		width: 500px;
	}

	.app-toolbar {
		position: absolute;
		width: 100%;
		padding-top: 10px;
		z-index: 2;
	}
</style>

