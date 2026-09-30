package com.treino.api.treino.repository;

import com.treino.api.treino.domain.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {}
