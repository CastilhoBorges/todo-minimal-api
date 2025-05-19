# OrbeFlow

Sistema completo para o setor de Recursos Humanos, focado no gerenciamento eficiente de ponto eletrônico, controle de jornada de trabalho e processos administrativos de RH.

## Tecnologias Utilizadas

- **Node.js** - v22.13.1
- **NestJS** - v11.0.0
- **TypeScript** - v5.7.3

## Decisões Técnicas

- Arquitetura baseada em monólito utilizando NestJS.
- Gerenciamento de configuração utilizando (ex: Dotenv, ConfigService do NestJS).
- Monitoramento e Observabilidade com (ex: Prometheus, Grafana, OpenTelemetry).

## Instalação e Configuração

1. Clone o repositório:

   ```sh
   git clone git@github.com:Zamblu/orbeflow-api.git
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd orbeflow-api
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

4. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` para `.env` e preencha as variáveis necessárias.

5. Execute a aplicação:

   ```sh
   npm run start
   ```

## Documentação da API

A documentação da API pode ser acessada através do Swagger:

```
http://localhost:3000/swagger


```

# Tutorial: Como Instalar e Usar o MailHog para Testes de E-mail

## O que é o MailHog?

**MailHog** é uma ferramenta de teste de SMTP para capturar e-mails enviados durante o desenvolvimento, sem realmente enviá-los para os destinatários. Ele é ideal para simular o envio de e-mails em ambientes de desenvolvimento e visualizar e-mails recebidos diretamente através de uma interface web.

## Requisitos

- **Linux Mint** ou qualquer sistema baseado no Linux.
- **MailHog**.
- **JavaScript/TypeScript** (se for utilizar com **NestJS** ou outro framework).
- **Nodemailer** (para envio de e-mails via SMTP).

## Passo 1: Baixar e Instalar o MailHog

### 1.1 Baixar o MailHog

Primeiro, baixe o arquivo binário do **MailHog**. Abra o terminal e execute o seguinte comando para obter a versão mais recente:

```bash
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64

chmod +x MailHog_linux_amd64

sudo mv MailHog_linux_amd64 /usr/local/bin/mailhog

mailhog
```

Interface Web: localhost:8025 (para visualizar os e-mails recebidos).

