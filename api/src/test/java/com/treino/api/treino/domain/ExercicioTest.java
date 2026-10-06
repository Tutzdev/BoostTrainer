package com.treino.api.treino.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExercicioTest {

    @Test
    void numeraAsSeriesNaOrdemEmQueSaoAdicionadas() {
        var exercicio = new Exercicio("Supino reto", null);

        exercicio.adicionarSerie(new Serie(12, 40.0));
        exercicio.adicionarSerie(new Serie(10, 45.0));
        exercicio.adicionarSerie(new Serie(8, 50.0));

        assertThat(exercicio.getSeries())
                .extracting(Serie::getNumero)
                .containsExactly(1, 2, 3);
    }

    @Test
    void naoRepeteNumeroDepoisDeRemoverUmaSerie() {
        var exercicio = new Exercicio("Agachamento", null);
        var primeira = new Serie(12, 60.0);
        exercicio.adicionarSerie(primeira);
        exercicio.adicionarSerie(new Serie(10, 70.0));

        exercicio.removerSerie(primeira);
        exercicio.adicionarSerie(new Serie(8, 80.0));

        assertThat(exercicio.getSeries())
                .extracting(Serie::getNumero)
                .containsExactly(2, 3);
    }

    @Test
    void vinculaASerieAoExercicio() {
        var exercicio = new Exercicio("Remada curvada", "pegada pronada");
        var serie = new Serie(10, 35.0);

        exercicio.adicionarSerie(serie);

        assertThat(serie.getExercicio()).isSameAs(exercicio);
    }
}
