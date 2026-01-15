const animationStates = new WeakMap();

  /********** animations **********/
  function animateFrom(el, initialTransform, durationMs) {
    ensureInlineBlockIfNeeded(el);

  // estado inicial (sem transition)
    el.style.transition = 'none';
    el.style.transform = initialTransform;
    el.style.opacity = '0';

  // força reflow para garantir que o browser registre o estado inicial
    void el.offsetWidth;

  // calcula transform final baseado no tipo (translateX/translateY)
    let finalTransform = 'translate(0, 0)';
    const m = initialTransform.match(/translate([XY])\s*\([^)]+\)/i);
    if (m) {
      finalTransform = m[1].toUpperCase() === 'X' ? 'translateX(0)' : 'translateY(0)';
    }

  // aplica a transição (depois do reflow)
    el.style.transition = `transform ${durationMs}ms ease, opacity ${durationMs}ms ease`;

  // no próximo frame manda para o estado final (isso dispara a animação)
    requestAnimationFrame(() => {
      el.style.transform = finalTransform;
      el.style.opacity = '1';
    });

    requestAnimationFrameAside(() => {
      el.style.transform = finalTransform;
      el.style.opacity = '0';
    })
  }


  function addTransition(el, property, durationMs, easing = 'ease') {
    const part = `${property} ${durationMs}ms ${easing}`;

  // pega transição atual (inline ou computada)
    const current = el.style.transition || getComputedStyle(el).transition || '';

  // se já contém o property, remove a entrada antiga
    const newCurrent = current
    .split(',')
    .map(s => s.trim())
    .filter(s => !s.startsWith(property))
    .filter(Boolean)
    .join(', ');

    el.style.transition = newCurrent ? `${part}, ${newCurrent}` : part;
  }

  
  function aplicaScrollReveal(selector, props) {
    const els = document.querySelectorAll(selector);
    if (!els.length) {
      macron('warn', `Nenhum elemento encontrado com nome ${selector} para ScrollReveal`)
      return;
    }

    const duration = toMs(props.duration) || 1000;
    const distance = props.distance || '20%';
    const origin = props.origin || 'bottom';

    els.forEach(el => {
      let transform = '';
      switch (origin) {
        case 'left':
          transform = `translateX(-${distance})`;
        break;
        case 'right':
          transform = `translateX(${distance})`;
        break;
        case 'top':
          transform = `translateY(-${distance})`;
        break;
        default:
          transform = `translateY(${distance})`;
      }

    el.style.opacity = '0';
    el.style.transform = transform;
    el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

    function revelar() {
      const rect = el.getBoundingClientRect();
      const visivel = rect.top < window.innerHeight && rect.bottom > 0;
      if (visivel) {
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0)';
        window.removeEventListener('scroll', revelar);
      }
    }

    window.addEventListener('scroll', revelar);
    revelar(); // já chama 1x se o elemento está visível
  });
  } 