# Filmes — catálogo pessoal

Um aplicativo web progressivo (PWA), responsivo e em português, para explorar filmes, séries e animes, pesquisar títulos, filtrar por categoria e guardar favoritos no navegador. Pode ser instalado pelo navegador como um app.

## Abrir, instalar ou baixar

Abra o app publicado em [amandab171207.github.io/Filmes](https://amandab171207.github.io/Filmes/) em qualquer dispositivo e use **Instalar app** (ou o menu do navegador para adicionar à tela inicial). Para baixar os arquivos, use **Code → Download ZIP** no repositório público; extraia o ZIP e abra `index.html`.

## Como abrir

1. Publique a pasta `filmes` em uma hospedagem HTTPS ou sirva-a em `localhost`.
2. Abra o endereço no navegador e escolha **Instalar app** (ou use o menu do navegador para adicionar à tela inicial).
3. Pesquise títulos, use os filtros, salve na biblioteca e marque o que já assistiu.

Para uma olhada rápida, também é possível abrir `index.html` diretamente, mas a instalação e o modo offline precisam de HTTPS ou localhost. A biblioteca e os status de assistido ficam salvos no armazenamento local de cada navegador/dispositivo.

## O que está incluído

- Categorias: Clássicos, Anos 2000, Animes, Séries, Ação, Comédia, Ficção Científica, Terror e Romance.
- Busca por título, ano e categorias.
- Biblioteca pessoal com persistência local.
- Lista “Já assisti” para filmes, séries e animes, salva localmente.
- Modal com sinopse e informações do título.
- Atalhos para pesquisar cada título nos catálogos de Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+, Globoplay, Crunchyroll e MUBI.
- Botão para selecionar seus serviços de streaming favoritos e abrir cada plataforma.
- Assistente local de recomendações por estilo, que também considera os títulos salvos na biblioteca.
- Aba **IA** na navegação para acessar o assistente de recomendações.
- Aba **Perfil**, com campo de nome e seleção de gêneros favoritos, salva no dispositivo.
- Layout adaptável para computador, tablet e celular.
- Instalação como PWA, ícone próprio e cache do app para abrir a interface sem conexão após a primeira visita.
- Dados locais de exemplo; imagens de pôster e imagem de destaque são carregadas por URLs públicas.

## Arquivos

- `index.html` — estrutura da página.
- `style.css` — cores, layout e adaptação a telas menores.
- `app.js` — catálogo de exemplo e interações.
- `manifest.webmanifest` e `sw.js` — configuração de instalação e cache offline.

Imagens públicas e a fonte tipográfica são carregadas pela internet. As recomendações são calculadas no próprio navegador comparando categorias do catálogo e itens da biblioteca; não usam um modelo generativo nem enviam dados para um serviço externo. O botão “Vincular streamings” guarda localmente quais serviços você selecionou e oferece atalhos para abri-los; não conecta credenciais ou assinaturas. Os atalhos nos detalhes abrem a busca do título em cada serviço; eles não confirmam disponibilidade, que varia por país e pode mudar. Se uma imagem não carregar, o app mostra um pôster de reserva.

