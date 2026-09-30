package com.treino.api.treino.repository;

import com.treino.api.treino.domain.DiaTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaTreinoRepository extends JpaRepository<DiaTreino, Long> {

    @Query("""
        SELECT DISTINCT dia
        FROM DiaTreino dia
        LEFT JOIN FETCH dia.exercicios exercicio
        LEFT JOIN FETCH exercicio.series
        """)

    List<DiaTreino> buscarTodosComExerciciosESeries();
}