export const triggerEvents: Record<string, (cb: (targets?: HTMLElement[]) => void, elements: NodeListOf<HTMLElement>) => void> = {
  // trigger que ativa ao carregar a página
  "window.onLoad": (cb) => {
    // Se o documento já está completamente carregado, dispara imediatamente
    if (document.readyState === "complete") {
      console.log("📄 Documento já está carregado, executando callback imediatamente");
      cb();
    } else {
      window.addEventListener("load", () => cb());
    }
  },

  // trigger que ativa quando o DOM está pronto
  "DOMContent.onLoad": (cb) => {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      cb();
    } else {
      window.addEventListener("DOMContentLoaded", () => cb());
    }
  },

  // trigger que ativa durante um simples clique
  "onSing.click": (cb, elements) => {
    // Single click - dispara ao clicar uma vez (apenas para elementos correspondentes)
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      for (const el of elements) {
        if (el === target || el.contains(target)) {
          cb([el]);
          break;
        }
      }
    });
  },

  // trigger que ativa durante um duplo clique
  "onDbl.click": (cb, elements) => {
    // Double click - dispara ao fazer double click (apenas para elementos correspondentes)
    document.addEventListener("dblclick", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      for (const el of elements) {
        if (el === target || el.contains(target)) {
          cb([el]);
          break;
        }
      }
    });
  },

  // trigger que ativa ao segurar o clique por um certo período de tempo
  "onHold.click": (cb, elements) => {
    // Hold click - dispara após manter pressionado por 250ms (apenas para elementos correspondentes)
    let holdTimeout: number | null = null;
    let startTarget: HTMLElement | null = null;

    document.addEventListener("mousedown", (e) => {
      startTarget = e.target as HTMLElement | null;
      holdTimeout = window.setTimeout(() => {
        if (!startTarget) return;
        for (const el of elements) {
          if (el === startTarget || el.contains(startTarget)) {
            cb([el]);
            break;
          }
        }
      }, 250);
    });

    document.addEventListener("mouseup", () => {
      if (holdTimeout !== null) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
        startTarget = null;
      }
    });

    document.addEventListener("mouseleave", () => {
      if (holdTimeout !== null) {
        clearTimeout(holdTimeout);
        holdTimeout = null;
        startTarget = null;
      }
    });
  },

  // trigger que ativa com o scroll da página - reveal: quando o elemento entra na viewport
  "reveal.onScroll": (cb, elements) => {
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          // chama o callback apenas para o elemento que entrou
          cb([el]);
          // opcional: parar de observar após revelar
          observer.unobserve(el);
        }
      }
    }, { threshold: 0.1 });

    for (const el of elements) observer.observe(el);
  },

  // trigger que ativa com o scroll da página - hide: quando o elemento sai da viewport
  "hide.onScroll": (cb, elements) => {
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          cb([el]);
          // continuar observando para futuros hides
        }
      }
    }, { threshold: 0 });

    for (const el of elements) observer.observe(el);
  }
};