# Hogwarts Academy — Clean Code & SOLID

Refactoring du projet TypeScript d'origine. Les 6 exercices du TAF sont préservés.

## Lancer

```bash
npm install
npm run typecheck
npm test
npm start
```

## Modules

- `types.ts`: modèles et utility types (`Omit`, `Pick`, `Record`, `Extract`, `Exclude`, conditional types, `infer`).
- `guards.ts`: validations d'entrées inconnues (`isHouse`, `isWizard`).
- `repository.ts`: stockage générique en mémoire, recherche et validation de doublons; `WizardRepository`, `SpellRepository`.
- `decorators.ts`: décorateurs historiques `@Log`, `@MeasureTime`, `@ValidateSpellPower`, `@Cache`.
- `academy-service.ts`: règles d'orchestration; dépend d'interfaces de lecture/écriture.
- `event-handler.ts`: événements de sorts typés avec `Extract`.
- `spell-calculator.ts`: exemple de cache par instance.
- `main.ts`: démonstration / composition root (pas de logique métier).
- `tests.ts`: tests de non-régression avec `node:assert`.

## Principes appliqués

- **SRP**: chaque module a une responsabilité claire.
- **OCP**: repository générique extensible par spécialisation sans modifier sa base.
- **LSP**: `SpellRepository` conserve la signature de `add`, mais restreint la valeur acceptée par sa validation; cette restriction mérite attention dans un usage polymorphe.
- **ISP**: interfaces séparées `ReadRepository` / `WriteRepository`.
- **DIP**: `AcademyService` dépend de contrats et reçoit ses dépendances par constructeur.

## Limites pédagogiques

- Le cache `@Cache` est réservé aux méthodes **synchrones, pures** avec arguments sérialisables en JSON. Il n'offre ni invalidation, ni limite de taille.
- Les copies du repository sont superficielles (suffisantes pour les entités plates actuelles).
- Le stockage est **en mémoire**: les données sont réinitialisées à chaque lancement.
- Les décorateurs sont au format **legacy** imposé par la consigne et `experimentalDecorators`.
