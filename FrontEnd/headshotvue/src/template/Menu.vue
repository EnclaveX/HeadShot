<template>
	<div id="app">
		<v-app id="inspire">
			<v-list>
				<v-list-group
					v-for="item in items"
					:key="item.name"
					v-model="item.active"
					:prepend-icon="item.icon"
					no-actions
				>
					<template v-slot:activator>
						<v-list-item-content>
							<v-list-item-title v-text="$i18n.t(`headshot.menu.${item.name}`)"/>
						</v-list-item-content>
					</template>

					<v-list-item
						v-for="subItem in item.menuItems"
						:key="subItem.title"
						@click="goUrl(subItem.name)"
					>
						<v-list-item-content>
							<v-list-item-title
								class="font-weight-light body-2 text-md-left"
								v-text="$i18n.t(`headshot.menu.${subItem.name}`)"
							/>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
			</v-list>
		</v-app>
	</div>
</template>

<script>
	import axios from "axios";
	import { baseApiUrl, showError } from "@/global";

	export default {
		data() {
			return {
				items: []
			};
		},
		methods: {
			goUrl(menu) {
				if (this.$router.currentRoute.path !== `/${menu}`) {
					this.$router.push({ path: `/${menu}` });
				}
			},
			async loadMenus() {
				const config = {
					method: "get",
					url: `${baseApiUrl}/menus`
				};

				axios(config)
					.then(menus => {
						this.items.push(...menus.data);
					})
					.catch(showError);
			}
		},
		created() {
			this.loadMenus();
		}
	};
</script>