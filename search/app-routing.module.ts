import { NgModule } from "@angular/core";
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from "@angular/router";
import { RoomDetailsComponent } from "./room-list/room-item/room-details/room-details.component";
import { SearchComponent } from "./search.component";

const appRoutes:Routes=[
    { path:'',redirectTo:'/search',pathMatch:'full' },
    { path:'search',component:SearchComponent },
    { path:'room-details',component:RoomDetailsComponent }
    
    // { path:'recipes',component:RecipesComponent,
    // canActivate:[AuthGuard],
    // children:[
    //     { path:'',component:RecipeStartComponent },
    //     { path:'new',component:RecipeEditComponent },
    //     { path:':id',component:RecipeDetailComponent,resolve:[RecipesResolverService]},
    //     { path:':id/edit',component:RecipeEditComponent,resolve:[RecipesResolverService] }
    // ] },
    // { path:'shopping-list',component:ShoppingListComponent },
    // { path:'auth',component:AuthComponent  }
];

@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{

}
