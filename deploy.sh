#!/bin/sh
# ==========================================================================
# BELLIV STRATEGY · deploy no servidor
#
# Rode POR SSH, de dentro do diretório onde o repositório foi clonado
# (normalmente public_html):
#
#   cd ~/public_html && sh deploy.sh
#
# Não precisa de Node no servidor: index.html e 404.html já vêm gerados no
# repositório, porque a integração Git só faz pull e não roda build.
#
# Usa `pull --ff-only`: se o servidor tiver alteração local que divergiu, o
# comando falha em vez de sobrescrever. Nesse caso resolva à mão e rode de novo.
# ==========================================================================

set -eu

if [ ! -d .git ]; then
  echo "erro: rode de dentro do diretório do repositório (o que tem .git)." >&2
  exit 1
fi

echo "· diretório: $(pwd)"
echo "· antes:     $(git rev-parse --short HEAD)  $(git log -1 --format=%s)"

git fetch origin

ANTES=$(git rev-parse HEAD)
REMOTO=$(git rev-parse origin/main)

if [ "$ANTES" = "$REMOTO" ]; then
  echo "· já está no commit mais novo. Nada a fazer."
else
  echo "· vai aplicar:"
  git --no-pager log --oneline "$ANTES..$REMOTO" | sed 's/^/    /'
  git pull --ff-only origin main
  echo "· depois:    $(git rev-parse --short HEAD)  $(git log -1 --format=%s)"
fi

# Conferência: o que o site serve de fato tem de ser o site, não a página antiga.
echo
if grep -q 'id="servicos"' index.html 2>/dev/null; then
  echo "✓ index.html é o site institucional"
else
  echo "✗ index.html NÃO parece ser o site institucional — confira o deploy" >&2
fi

if [ -f .htaccess ]; then
  echo "✓ .htaccess presente (bloqueio de docs/, src/, test/ e do JSON de tokens)"
else
  echo "✗ .htaccess AUSENTE — docs/ ficaria público. Não deixe assim." >&2
fi

echo
echo "Se o navegador ainda mostrar a versão antiga, limpe o cache no hPanel"
echo "(Avançado › Cache) e teste em aba anônima: o HTML tem cache de 5 minutos."
