/**
 * KAVOD AUTO DETAILING - Lógica Principal
 * Arquitectura de Vistas Múltiples (SPA Pattern) + Long-Scroll interno
 *
 * Mapa de hashes:
 *  - Vistas (main.vista):     #inicio, #portafolio, #contacto
 *  - Anclas internas (scroll): #servicios, #paquetes, #nosotros, #faq
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================================
       0. REFERENCIAS GLOBALES
       ===================================================================== */
    const vistas        = document.querySelectorAll('.vista');
    const navLinks      = document.querySelectorAll('.nav-link');

    const botonMenu             = document.getElementById('boton-menu');
    const navegacionPrincipal   = document.getElementById('navegacion-principal');
    const iconoMenu             = document.getElementById('icono-menu');
    const iconoCerrar           = document.getElementById('icono-cerrar');

    const modalGlobal     = document.getElementById('modal-global');
    const modalContenido  = document.getElementById('modal-contenido');
    const btnCerrarIcono  = document.getElementById('cerrar-modal-icono');
    const btnCerrarBoton  = document.getElementById('cerrar-modal-boton');

    const formularios = [
        document.getElementById('formulario-contacto'),
        document.getElementById('formulario-contacto-page')
    ].filter(Boolean);


    /* =====================================================================
       1. MAPA DE HASHES → VISTAS
       ===================================================================== */
    const MAPA_VISTAS = {
        '#inicio'      : '#vista-inicio',
        '#servicios'   : '#vista-inicio',
        '#paquetes'    : '#vista-inicio',
        '#nosotros'    : '#vista-inicio',
        '#faq'         : '#vista-inicio',
        '#portafolio'  : '#vista-portafolio',
        '#contacto'    : '#vista-contacto'
    };

    const ANCLAS_INTERNAS = ['#servicios', '#paquetes', '#nosotros', '#faq'];

    const resolverVista = (hash) => MAPA_VISTAS[hash] || '#vista-inicio';


    /* =====================================================================
       2. MENÚ HAMBURGUESA — declarado como función (hoisted)
       ===================================================================== */
    function toggleMenu() {
        if (!navegacionPrincipal || !botonMenu) return;

        const isActivo = navegacionPrincipal.classList.toggle('menu-activo');
        botonMenu.setAttribute('aria-expanded', String(isActivo));
        botonMenu.setAttribute('aria-label', isActivo ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');

        if (isActivo) {
            iconoMenu.classList.add('hidden');
            iconoCerrar.classList.remove('hidden');
        } else {
            iconoMenu.classList.remove('hidden');
            iconoCerrar.classList.add('hidden');
        }
    }

    if (botonMenu && navegacionPrincipal) {
        botonMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (navegacionPrincipal.classList.contains('menu-activo')) {
                if (!navegacionPrincipal.contains(e.target) && !botonMenu.contains(e.target)) {
                    toggleMenu();
                }
            }
        });

        // Cerrar menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navegacionPrincipal.classList.contains('menu-activo')) {
                toggleMenu();
            }
        });
    }


    /* =====================================================================
       3. SISTEMA DE VISTAS MÚLTIPLES
       ===================================================================== */
    const mostrarVista = (hash) => {
        const targetHash  = hash || '#inicio';
        const vistaId     = resolverVista(targetHash);
        const vistaTarget = document.querySelector(vistaId);

        if (!vistaTarget || !vistaTarget.classList.contains('vista')) {
            return mostrarVista('#inicio');
        }

        // Ocultar todas las vistas EXCEPTO la objetivo (evita flicker)
        vistas.forEach(vista => {
            if (vista !== vistaTarget) {
                vista.classList.add('vista-oculta');
            }
        });

        // Mostrar la vista objetivo
        vistaTarget.classList.remove('vista-oculta');

        // Actualizar hash (evitar pushState duplicado en carga inicial)
        const hashActual = window.location.hash || '#inicio';
        if (history.pushState) {
            if (hashActual !== targetHash) {
                history.pushState(null, null, targetHash);
            }
        } else {
            window.location.hash = targetHash;
        }

        // Scroll suave al ancla interna o al top
        if (ANCLAS_INTERNAS.includes(targetHash)) {
            requestAnimationFrame(() => {
                const seccion = document.querySelector(targetHash);
                if (seccion) {
                    const offset = 80;
                    const top = seccion.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Actualizar estado activo de los nav-links
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const activo = href === targetHash;
            link.classList.toggle('text-kavod-gold', activo);
            link.classList.toggle('text-kavod-white', !activo);
        });

        // Cerrar el menú móvil si estaba abierto
        if (navegacionPrincipal && navegacionPrincipal.classList.contains('menu-activo')) {
            toggleMenu();
        }
    };

    // Escuchar clics en anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (!hash || hash === '#') return;

            if (MAPA_VISTAS[hash] || document.querySelector(hash)) {
                e.preventDefault();
                mostrarVista(hash);
            }
        });
    });

    // Sincronizar con back/forward del navegador
    window.addEventListener('popstate', () => {
        mostrarVista(window.location.hash || '#inicio');
    });

    // Vista inicial
    mostrarVista(window.location.hash || '#inicio');


    /* =====================================================================
       4. MODAL GLOBAL (4 métodos de cierre + focus management)
       ===================================================================== */
    let ultimoFoco = null;

    const abrirModal = () => {
        if (!modalGlobal) return;

        ultimoFoco = document.activeElement;

        modalGlobal.classList.remove('hidden');
        modalGlobal.classList.add('flex');
        modalGlobal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-abierto');

        setTimeout(() => {
            modalContenido.classList.remove('scale-95');
            modalContenido.classList.add('scale-100');
            // Foco al botón principal para accesibilidad por teclado
            btnCerrarBoton?.focus();
        }, 10);
    };

    const cerrarModal = () => {
        if (!modalGlobal) return;

        modalContenido.classList.remove('scale-100');
        modalContenido.classList.add('scale-95');

        setTimeout(() => {
            modalGlobal.classList.add('hidden');
            modalGlobal.classList.remove('flex');
            modalGlobal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-abierto');
            // Devolver foco al disparador
            ultimoFoco?.focus();
            ultimoFoco = null;
        }, 300);
    };

    btnCerrarIcono?.addEventListener('click', cerrarModal);
    btnCerrarBoton?.addEventListener('click', cerrarModal);
    modalGlobal?.addEventListener('click', (e) => {
        if (e.target === modalGlobal) cerrarModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalGlobal && !modalGlobal.classList.contains('hidden')) {
            cerrarModal();
        }
    });


    /* =====================================================================
       5. FORMULARIOS DE CONTACTO (Hero + Vista Contacto)
       ===================================================================== */
    formularios.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: integrar fetch/AJAX real aquí si se requiere
            abrirModal();
            form.reset();
        });
    });


    /* =====================================================================
       6. AÑO DINÁMICO EN EL FOOTER
       ===================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});