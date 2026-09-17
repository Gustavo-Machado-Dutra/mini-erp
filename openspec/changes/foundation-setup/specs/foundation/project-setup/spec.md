# Spec Delta

## Purpose

Garante que a aplicação Next.js existe, compila sem erros e possui TypeScript strict, Tailwind CSS e shadcn/ui configurados como base para todo o desenvolvimento do RevenueFlow.

## ADDED Requirements

### Requirement: Aplicação Next.js inicializada

A aplicação SHALL estar configurada com Next.js 15, App Router, React e TypeScript strict mode habilitado.

#### Scenario: Build sem erros de compilação

- **WHEN** o comando de build é executado (
pm run build)
- **THEN** a aplicação compila sem erros de TypeScript e sem falhas de build

#### Scenario: TypeScript strict ativo

- **WHEN** um arquivo TypeScript é introduzido sem tipos adequados (ex: ny implícito)
- **THEN** o compilador TypeScript deve emitir erro antes que o código seja aceito

### Requirement: Tailwind CSS configurado

A aplicação SHALL ter Tailwind CSS configurado e funcionando para estilização.

#### Scenario: Classes Tailwind aplicadas

- **WHEN** uma classe Tailwind (ex: className="p-4 text-lg") é usada em um componente
- **THEN** os estilos correspondentes são gerados no CSS de saída do build

### Requirement: shadcn/ui disponível

A aplicação SHALL ter shadcn/ui instalado e os componentes disponíveis para uso.

#### Scenario: Componente shadcn/ui utilizável

- **WHEN** um componente shadcn/ui é importado (ex: Button de @/components/ui/button)
- **THEN** ele renderiza sem erros e com os estilos corretos

### Requirement: ESLint configurado

A aplicação SHALL ter ESLint configurado para Next.js e TypeScript; o comando de lint SHALL executar sem erros na base inicial do projeto.

#### Scenario: Lint sem erros na fundação

- **WHEN** o comando de lint é executado (
pm run lint)
- **THEN** nenhum erro de lint é reportado nos arquivos gerados pela fundação
