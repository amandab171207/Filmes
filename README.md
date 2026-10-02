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
- Assistente em formato de conversa que recomenda títulos do catálogo conforme o pedido, as preferências do perfil e a biblioteca.
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


## Pastas da biblioteca
Use o botão **Pastas** para criar e remover pastas personalizadas. Abra os detalhes de qualquer título, marque uma ou mais pastas e salve. As pastas e associações ficam guardadas no armazenamento local do navegador deste dispositivo; para sincronizar entre dispositivos seria necessário um serviço com conta e armazenamento online.

## Limite do catálogo
O app inclui um catálogo local de exemplos. Ele não reúne automaticamente todos os filmes, séries, animes e doramas de todos os serviços: esse catálogo muda por país e ao longo do tempo e requer integração com uma fonte de dados atualizada e configuração de servidor. Os atalhos de streaming servem para pesquisar o título nos serviços.


## Páginas por tipo
O catálogo tem páginas de Filmes, Séries, Animes, Doramas e Novelas, com paginação de resultados. As entradas de doramas e novelas são exemplos locais e podem não representar o catálogo completo ou a disponibilidade atual dos streamings.


## Idiomas
O filtro e os detalhes mostram o idioma original dos títulos de exemplo. Áudios dublados e legendas mudam conforme o título, o país e o serviço; o app não consulta esses dados nem vincula contas de streaming.


## Destaques do banner
O banner inicial alterna entre Novidades (ordenadas pelo ano do catálogo local) e Em alta (ordenadas pela nota cadastrada). Use as setas para navegar e abra os detalhes do título em destaque.


## Sincronização na nuvem (opcional)
A sincronização usa Supabase Auth e uma tabela privada por usuário.

1. Crie um projeto Supabase e execute [`cloud-setup.sql`](cloud-setup.sql) no SQL Editor.
2. Em Authentication → URL Configuration, adicione `https://amandab171207.github.io/Filmes/` como Site URL e Redirect URL.
3. No app, abra **Nuvem → Configurar a conexão**, informe a Project URL e a chave pública (publishable/anon) e salve. Nunca use a `service_role`/secret key no navegador.
4. Crie uma conta e entre com o mesmo e-mail em cada aparelho; então toque **Sincronizar agora**.

Favoritos, títulos assistidos, pastas, perfil e streamings selecionados são enviados. Em um conflito entre alterações offline, o app pede para escolher a versão deste aparelho ou da nuvem. Sem a configuração do projeto, a nuvem permanece desconectada e os dados continuam locais.


## Conectar sincronização na nuvem
1. Crie um projeto Supabase e execute [`cloud-setup.sql`](cloud-setup.sql) no SQL Editor.
2. Em Authentication → URL Configuration, defina `https://amandab171207.github.io/Filmes/` como Site URL/URL de redirecionamento.
3. No app, abra **Nuvem → Configurar a conexão**, informe a Project URL e a chave pública do projeto e salve. Nunca use a chave `service_role` ou uma chave secreta no navegador.
4. Crie uma conta e entre com o mesmo e-mail e senha em cada dispositivo. Use **Sincronizar agora** para enviar ou receber favoritos, assistidos, pastas, perfil e streamings escolhidos. Em alterações divergentes, escolha qual versão manter.

A URL/chave pública é guardada localmente em cada dispositivo e deve ser configurada uma vez em cada navegador. Sem um projeto Supabase conectado, os dados continuam locais.


O banner de destaques agora ocupa toda a faixa inicial e apresenta a arte de fundo e o pôster do título selecionado.

