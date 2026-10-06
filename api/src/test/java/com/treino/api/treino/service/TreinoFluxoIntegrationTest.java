package com.treino.api.treino.service;

import com.treino.api.treino.domain.DiaSemana;
import com.treino.api.treino.dto.CreateDiaTreinoRequest;
import com.treino.api.treino.dto.CreateExercicioRequest;
import com.treino.api.treino.dto.CreateSerieRequest;
import com.treino.api.treino.dto.DiaTreinoResponse;
import com.treino.api.treino.dto.ExercicioResponse;
import com.treino.api.treino.dto.SerieResponse;
import com.treino.api.treino.exception.RecursoNaoEncontradoException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

@SpringBootTest
@Transactional
class TreinoFluxoIntegrationTest {

    @Autowired
    private DiaTreinoService diaTreinoService;

    @Autowired
    private ExercicioService exercicioService;

    @Autowired
    private SerieService serieService;

    @Test
    void montaUmTreinoCompletoEDevolveAHierarquiaAninhada() {
        DiaTreinoResponse dia = diaTreinoService.criar(new CreateDiaTreinoRequest(DiaSemana.values()[0], "Peito e tríceps"));
        ExercicioResponse supino = exercicioService.adicionarAoDiaTreino(dia.id(), new CreateExercicioRequest("Supino reto", "barra"));
        serieService.adicionarAoExercicio(supino.id(), new CreateSerieRequest(12, 40.0));
        serieService.adicionarAoExercicio(supino.id(), new CreateSerieRequest(10, 45.0));

        DiaTreinoResponse treino = diaTreinoService.buscarPorId(dia.id());

        assertThat(treino.nome()).isEqualTo("Peito e tríceps");
        assertThat(treino.exercicios()).singleElement().satisfies(exercicio -> {
            assertThat(exercicio.nome()).isEqualTo("Supino reto");
            assertThat(exercicio.series())
                    .extracting(SerieResponse::numero, SerieResponse::repeticoes, SerieResponse::carga)
                    .containsExactly(
                            tuple(1, 12, 40.0),
                            tuple(2, 10, 45.0));
        });
    }

    @Test
    void apagarODiaRemoveExerciciosESeries() {
        DiaTreinoResponse dia = diaTreinoService.criar(new CreateDiaTreinoRequest(DiaSemana.values()[1], "Pernas"));
        ExercicioResponse agachamento = exercicioService.adicionarAoDiaTreino(dia.id(), new CreateExercicioRequest("Agachamento", null));
        serieService.adicionarAoExercicio(agachamento.id(), new CreateSerieRequest(10, 80.0));

        diaTreinoService.deletar(dia.id());

        assertThatThrownBy(() -> diaTreinoService.buscarPorId(dia.id()))
                .isInstanceOf(RecursoNaoEncontradoException.class);
        assertThatThrownBy(() -> serieService.adicionarAoExercicio(agachamento.id(), new CreateSerieRequest(8, 90.0)))
                .isInstanceOf(RecursoNaoEncontradoException.class);
    }

    @Test
    void recusaExercicioEmDiaInexistente() {
        assertThatThrownBy(() -> exercicioService.adicionarAoDiaTreino(999_999L, new CreateExercicioRequest("Rosca", null)))
                .isInstanceOf(RecursoNaoEncontradoException.class);
    }
}
