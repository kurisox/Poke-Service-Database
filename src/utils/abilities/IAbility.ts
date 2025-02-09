export interface IAbility {
    id: number;
    name:string;
    names:[{
        language: string;
        name: string;
    }];
    generation: string;
    effect: [{
        effect: string;
        language: string;
    }];
    flavour_text : [{
        flavour_text: string;
        language: string;
    }];
    pokemon: [string];
}