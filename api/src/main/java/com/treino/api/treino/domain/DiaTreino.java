package com.treino.api.treino.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity 
@Table(name = "dia_treino")
public class DiaTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DiaSemana dia;

    private String nome;

    @OneToMany(mappedBy = "diaTreino", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private final List<Exercicio> exercicios = newArrayList<>();

    protected DiaTreino {

    }

    public DiaTreino(DiaSemana dia, String nome) {
        this.dia = dia;
        this.nome = nome;
    }

    public void atualizarDados(DiaSemana dia, String nome) {
        this.dia = dia;
        this.nome = nome;
    }

    public void adicionarExercicio(Exercicio exercicio) {
        exercicio.vincularAoDia(this);
        this.exercicios.add(exercicio);
    }

    public void removerExercicio(Exercicio exercicio) {
        this.exercicios.remove(exercicio);
    }

    public Long getId() {
        return id;
    }

    public DiaSemana getDia() {
        return dia;
    }

    public String getNome() {
        return nome;
    }

    public List<Exercicio> getExercicios() {
        return List.copyOf(exercicios);
    }

    @Override 
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }
        if(!(outro instanceof DiaTreino outrodDiaTreino)) {
            return false;
        }
        return id != null && id.equals(outrodDiaTreino.id);
    }

    @Override
    public String toString() {
        return "DiaTreino{id=%d, dia=%s, nome='%s'}".formatted(id, dia, nome);
    }

}